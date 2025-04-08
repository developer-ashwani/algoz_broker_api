const express = require('express');
const router = express.Router();
const { fyersAuth } = require('../../config/fyers');

// Apply Fyers authentication middleware
router.use(fyersAuth);

// Get all orders
router.get('/', async (req, res) => {
    try {
        const ordersResponse = await req.fyers.get_orders();
        
        if (ordersResponse.code === 200) {
            res.json({
                success: true,
                code: ordersResponse.code,
                data: ordersResponse.orderBook,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: ordersResponse.code,
                error: 'Orders Fetch Failed',
                message: ordersResponse.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Orders Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get filtered orders by ID
router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const reqBody = {
            order_id: orderId
        };

        const filteredOrdersResponse = await req.fyers.get_filtered_orders(reqBody);
        
        if (filteredOrdersResponse.code === 200) {
            res.json({
                success: true,
                code: filteredOrdersResponse.code,
                data: filteredOrdersResponse.orderBook,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: filteredOrdersResponse.code,
                error: 'Filtered Orders Fetch Failed',
                message: filteredOrdersResponse.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Filtered Orders Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
