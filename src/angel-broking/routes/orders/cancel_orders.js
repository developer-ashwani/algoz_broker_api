// API for canceling orders
const express = require('express');
const router = express.Router();
const { angelAuth } = require('../../config/angel');

// Apply Angel authentication middleware
router.use(angelAuth);

// Constants for validation
const VALID_VARIETIES = ['NORMAL', 'STOPLOSS', 'ROBO'];

// Cancel order
router.post('/', async (req, res) => {
    try {
        const { variety, orderid } = req.body;

        // Validate required fields
        if (!variety || !orderid) {
            return res.status(400).json({
                status: false,
                message: 'Missing required fields',
                errorcode: 'MISSING_FIELDS',
                data: null
            });
        }

        // Validate variety
        if (!VALID_VARIETIES.includes(variety)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid variety',
                errorcode: 'INVALID_VARIETY',
                data: null
            });
        }

        // Validate orderid format (assuming it's a string of numbers)
        if (!/^\d+$/.test(orderid)) {
            return res.status(400).json({
                status: false,
                message: 'Invalid order ID format',
                errorcode: 'INVALID_ORDER_ID',
                data: null
            });
        }

        // Call Angel API to cancel order
        const response = await req.angel.smartApi.cancelOrder({
            variety,
            orderid
        });

        // Return success response
        return res.json({
            status: true,
            message: 'SUCCESS',
            errorcode: '',
            data: {
                orderid: orderid,
                uniqueorderid: response.uniqueorderid || ''
            }
        });

    } catch (error) {
        console.error('Error canceling order:', error);
        return res.status(500).json({
            status: false,
            message: error.message || 'Failed to cancel order',
            errorcode: 'INTERNAL_ERROR',
            data: null
        });
    }
});

module.exports = router;
