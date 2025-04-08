const express = require('express');
const router = express.Router();
const { fyersAuth } = require('../../config/fyers');

// Apply Fyers authentication middleware
router.use(fyersAuth);

// Cancel single order
router.delete('/', async (req, res) => {
    try {
        const { id } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'id is required',
                timestamp: new Date().toISOString()
            });
        }

        const cancelResponse = await req.fyers.cancel_order({ id });
        
        if (cancelResponse.s === 'ok') {
            res.json({
                success: true,
                code: cancelResponse.code,
                message: cancelResponse.message,
                id: cancelResponse.id,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: cancelResponse.code,
                error: 'Order Cancellation Failed',
                message: cancelResponse.message || 'Failed to cancel order',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Order Cancellation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Cancel multiple orders
router.delete('/multi', async (req, res) => {
    try {
        const orders = req.body;

        // Validate that orders is an array
        if (!Array.isArray(orders)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Request Format',
                message: 'Request body must be an array of orders',
                timestamp: new Date().toISOString()
            });
        }

        // Validate maximum number of orders
        if (orders.length > 10) {
            return res.status(400).json({
                success: false,
                error: 'Too Many Orders',
                message: 'Maximum 10 orders can be cancelled simultaneously',
                timestamp: new Date().toISOString()
            });
        }

        // Validate each order
        for (const order of orders) {
            if (!order.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing Required Fields',
                    message: 'id is required for each order',
                    timestamp: new Date().toISOString()
                });
            }
        }

        const cancelResponse = await req.fyers.cancel_multi_order(orders);
        
        if (cancelResponse.s === 'ok') {
            res.json({
                success: true,
                code: cancelResponse.code,
                message: cancelResponse.message,
                data: cancelResponse.data,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: cancelResponse.code,
                error: 'Multi Order Cancellation Failed',
                message: cancelResponse.message || 'Failed to cancel orders',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Multi Order Cancellation Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
