const express = require('express');
const router = express.Router();
const aliceblueAPI = require('../../config/aliceblue.api');

/**
 * @route GET /api/aliceblue/orders/orderbook
 * @desc Get order book for the account
 * @access Private
 */
router.get('/orderbook', async (req, res) => {
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

        // Get order book using API class
        const orderBook = await aliceblueAPI.getOrderBook(token);

        // Send success response
        res.status(200).json({
            success: true,
            data: orderBook
        });

    } catch (error) {
        console.error('Error fetching order book:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

/**
 * @route POST /api/aliceblue/orders/history
 * @desc Get order history for a specific order
 * @access Private
 */
router.post('/history', async (req, res) => {
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
        const requiredFields = ['nestOrderNumber'];
        const missingFields = requiredFields.filter(field => !order[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Get order history using API class
        const orderHistory = await aliceblueAPI.getOrderHistory(order, token);

        // Send success response
        res.status(200).json({
            success: true,
            data: orderHistory
        });

    } catch (error) {
        console.error('Error fetching order history:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

module.exports = router;
