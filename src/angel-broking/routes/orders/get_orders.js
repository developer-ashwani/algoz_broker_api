const express = require('express');
const router = express.Router();
const { angelAuth } = require('../../config/angel');

// Apply Angel authentication middleware
router.use(angelAuth);

// Get order book
router.get('/orderbook', async (req, res) => {
    try {
        const response = await req.angel.smartApi.getOrderBook();
        res.json({
            status: response.status,
            message: response.message,
            data: response.data
        });
    } catch (error) {
        console.error('Order Book Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch order book'
        });
    }
});

module.exports = router;