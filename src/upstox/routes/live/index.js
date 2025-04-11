const express = require('express');
const router = express.Router();
const { upstoxAuth } = require('../../config/upstox');
// Import route handlers
const historicalCandleDataRouter = require('./historical/historical_candle_data');
const intradayCandleDataRouter = require('./historical/intraday_candle_data');
const getOrdersRouter = require('./orders/get_orders');
const modifyOrdersRouter = require('./orders/modify_orders');
const cancelOrdersRouter = require('./orders/cancel_orders');
const placeOrdersRouter = require('./orders/place_orders'); 
const profileRouter = require('./profile/profile');
const portfolioRouter = require('./portfolio/portfolio');
const websocketRouter = require('./websocket');
const optionChainRouter = require('./option_chain/option_chain');

// Apply Upstox authentication middleware to all routes
router.use(upstoxAuth);

// Route definitions
router.use('/historical', historicalCandleDataRouter);
router.use('/intraday', intradayCandleDataRouter);
router.use('/orders/get', getOrdersRouter);
router.use('/orders/modify', modifyOrdersRouter);
router.use('/orders/cancel', cancelOrdersRouter);
router.use('/orders/place', placeOrdersRouter); 
router.use('/profile', profileRouter);
router.use('/portfolio', portfolioRouter);
router.use('/websocket', websocketRouter);
router.use('/option-chain', optionChainRouter);

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
    console.error('Live API Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});



module.exports = router; 