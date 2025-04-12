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

// Route definitions
router.use('/user', userRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/historical', historicalRoutes);

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
        });
    }
});

module.exports = router;