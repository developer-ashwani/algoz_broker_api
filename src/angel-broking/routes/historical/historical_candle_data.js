// API for Historical Candle Data
const express = require('express');
const router = express.Router();
const { angelAuth } = require('../../config/angel');

// Apply Angel authentication middleware
router.use(angelAuth);

// Constants for validation
const VALID_EXCHANGES = ['NSE', 'NFO', 'BSE', 'BFO', 'CDS', 'MCX'];
const VALID_INTERVALS = [
    'ONE_MINUTE',
    'THREE_MINUTE',
    'FIVE_MINUTE',
    'TEN_MINUTE',
    'FIFTEEN_MINUTE',
    'THIRTY_MINUTE',
    'ONE_HOUR',
    'ONE_DAY'
];

// Max days allowed per interval
const MAX_DAYS_PER_INTERVAL = {
    'ONE_MINUTE': 30,
    'THREE_MINUTE': 60,
    'FIVE_MINUTE': 100,
    'TEN_MINUTE': 100,
    'FIFTEEN_MINUTE': 200,
    'THIRTY_MINUTE': 200,
    'ONE_HOUR': 400,
    'ONE_DAY': 2000
};

// Get historical candle data
router.post('/candles', async (req, res) => {
    try {
        const { exchange, symboltoken, interval, fromdate, todate } = req.body;

        // Validate required fields
        if (!exchange || !symboltoken || !interval || !fromdate || !todate) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields',
                required: ['exchange', 'symboltoken', 'interval', 'fromdate', 'todate']
            });
        }

        // Validate exchange
        if (!VALID_EXCHANGES.includes(exchange)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid exchange',
                valid_exchanges: VALID_EXCHANGES
            });
        }

        // Validate interval
        if (!VALID_INTERVALS.includes(interval)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid interval',
                valid_intervals: VALID_INTERVALS
            });
        }

        // Validate date format and range
        const fromDate = new Date(fromdate);
        const toDate = new Date(todate);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid date format. Use format: YYYY-MM-DD HH:mm',
                example: '2024-04-11 09:15'
            });
        }

        // Calculate date difference in days
        const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
        const maxDays = MAX_DAYS_PER_INTERVAL[interval];

        if (daysDiff > maxDays) {
            return res.status(400).json({
                status: 'error',
                message: `Date range exceeds maximum allowed days for ${interval}`,
                max_days_allowed: maxDays,
                days_requested: daysDiff
            });
        }

        // Get candle data using SmartAPI
        const response = await req.angel.smartApi.getCandleData({
            exchange,
            symboltoken,
            interval,
            fromdate: fromdate,
            todate: todate
        });

        // Format the response
        res.json({
            status: response.status,
            message: response.message,
            data: response.data.map(candle => ({
                timestamp: candle[0],
                open: candle[1],
                high: candle[2],
                low: candle[3],
                close: candle[4],
                volume: candle[5]
            }))
        });

    } catch (error) {
        console.error('Historical Data Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch historical data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get historical OI data
router.post('/oi', async (req, res) => {
    try {
        const { exchange, symboltoken, interval, fromdate, todate } = req.body;

        // Validate required fields
        if (!exchange || !symboltoken || !interval || !fromdate || !todate) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields',
                required: ['exchange', 'symboltoken', 'interval', 'fromdate', 'todate']
            });
        }

        // Validate exchange (OI data is only available for F&O)
        if (exchange !== 'NFO') {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid exchange. OI data is only available for NFO',
                valid_exchange: 'NFO'
            });
        }

        // Validate interval
        if (!VALID_INTERVALS.includes(interval)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid interval',
                valid_intervals: VALID_INTERVALS
            });
        }

        // Validate date format and range
        const fromDate = new Date(fromdate);
        const toDate = new Date(todate);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid date format. Use format: YYYY-MM-DD HH:mm',
                example: '2024-06-07 09:15'
            });
        }

        // Calculate date difference in days
        const daysDiff = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
        const maxDays = MAX_DAYS_PER_INTERVAL[interval];

        if (daysDiff > maxDays) {
            return res.status(400).json({
                status: 'error',
                message: `Date range exceeds maximum allowed days for ${interval}`,
                max_days_allowed: maxDays,
                days_requested: daysDiff
            });
        }

        // Get OI data using SmartAPI
        const response = await req.angel.smartApi.getOIData({
            exchange,
            symboltoken,
            interval,
            fromdate: fromdate,
            todate: todate
        });

        // Format the response
        res.json({
            status: response.status,
            message: response.message,
            data: response.data 
            // data: Array.isArray(response.data) ? response.data.map(item => ({
            //     time: item.time,
            //     oi: item.oi
            // })) : []
        });

    } catch (error) {
        console.error('Historical OI Data Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch historical OI data',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
