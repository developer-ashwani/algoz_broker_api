// Import route handlers
// Route definitions
// Route validation middleware
// Error handling middleware

const express = require('express');
const router = express.Router();

// Import route handlers
const userRoutes = require('./users/user');
const portfolioRoutes = require('./portfolio/portfolio');
const historicalRoutes = require('./historical/historical_candle_data');
const placeOrderRoutes = require('./orders/place_orders');
const modifyOrderRoutes = require('./orders/modify_orders');
const cancelOrderRoutes = require('./orders/cancel_orders');
const getOrderRoutes = require('./orders/get_orders');

// Route definitions
router.use('/user', userRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/historical', historicalRoutes);
router.use('/orders/place', placeOrderRoutes);
router.use('/orders/modify', modifyOrderRoutes); 
router.use('/orders/cancel', cancelOrderRoutes);
router.use('/orders', getOrderRoutes); 

// Route validation middleware - 404 handler
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
    if (!res.headersSent) {
        const status = err.status || 500;
        res.status(status).json({
            error: err.name || 'Internal Server Error',
            message: err.message || 'An unexpected error occurred',
            timestamp: new Date().toISOString(),
            // Only include error details in development
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

module.exports = router;