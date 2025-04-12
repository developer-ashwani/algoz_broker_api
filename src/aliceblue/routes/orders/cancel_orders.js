const express = require('express');
const router = express.Router();
const aliceblueAPI = require('../../config/aliceblue.api');

/**
 * @route POST /api/aliceblue/orders/cancel
 * @desc Cancel an existing order
 * @access Private
 */
router.post('/', async (req, res) => {
    try {
        // Get authorization header from request
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header is required'
            });
        }

        // Extract token from Authorization header
        // Format: "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization token format'
            });
        }

        // Get order details from request body
        const order = req.body;

        // Validate required fields
        const requiredFields = [
            'exch',
            'nestOrderNumber',
            'trading_symbol',
            'deviceNumber'
        ];

        const missingFields = requiredFields.filter(field => !order[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate exchange
        const validExchanges = ['NSE', 'BSE', 'NFO', 'MCX'];
        if (!validExchanges.includes(order.exch)) {
            return res.status(400).json({
                success: false,
                message: `Invalid exchange. Must be one of: ${validExchanges.join(', ')}`
            });
        }

        // Cancel order using API class
        const response = await aliceblueAPI.cancelOrder(order, token);

        // Send success response
        res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Error canceling order:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

module.exports = router;
