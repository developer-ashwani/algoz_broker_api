const express = require('express');
const router = express.Router();

// Import route handlers
const userRoutes = require('./Users/user');
const portfolioRoutes = require('./portfolio/portfolio');
const getOrdersRoutes = require('./orders/get_orders');
const placeOrdersRoutes = require('./orders/place_orders');
const modifyOrdersRoutes = require('./orders/modify_orders');
const cancelOrdersRoutes = require('./orders/cancel_orders');
const historicalRoutes = require('./historical/historical_candle_data');



// Route definitions
router.use('/user', userRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/orders', getOrdersRoutes);
router.use('/orders/place', placeOrdersRoutes);
router.use('/orders/modify', modifyOrdersRoutes);
router.use('/orders/cancel', cancelOrdersRoutes);
router.use('/historical', historicalRoutes);

// Route validation middleware
router.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).json({
            error: 'Not Found',
            message: `Route ${req.method} ${req.originalUrl} not found`,
            timestamp: new Date().toISOString()
        });
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Fyers API Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

module.exports = router; 