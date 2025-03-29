const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../../config/upstox');

// Validate date format (YYYY-MM-DD)
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Available intervals mapping
const INTERVALS = {
    '1minute': '1minute',
    '30minute': '30minute',
    'day': 'day',
    'week': 'week',
    'month': 'month'
};

// Route for each interval type
Object.entries(INTERVALS).forEach(([routeName, intervalValue]) => {
    router.get(`/${routeName}`, async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
            const client = initializeUpstox(token);
            
            const historyApi = new UpstoxClient.HistoryApi(client);

            // Get and validate query parameters
            const { instrumentKey, fromDate, toDate } = req.query;

            // Validation checks
            if (!instrumentKey) {
                return res.status(400).json({ error: 'instrumentKey is required' });
            }
            if (!fromDate || !toDate) {
                return res.status(400).json({ error: 'fromDate and toDate are required' });
            }
            if (!isValidDate(fromDate) || !isValidDate(toDate)) {
                return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
            }

            // Log request for debugging
            console.log(`Fetching ${routeName} Historical Data:`, {
                instrumentKey,
                interval: intervalValue,
                fromDate,
                toDate
            });

            const opts = {
                headers: {
                    'accept': 'application/json',
                    'api-version': '2.0'
                }
            };

            historyApi.getHistoricalCandleData1(
                instrumentKey, 
                intervalValue, 
                toDate, 
                fromDate, 
                opts, 
                (error, data, response) => {
                    if (error) {
                        console.error(`${routeName} Historical Data Error:`, error);
                        return res.status(500).json({ 
                            error: error.message,
                            details: error.response?.body
                        });
                    }
                    res.json({
                        status: 'success',
                        interval: routeName,
                        data: data
                    });
                }
            );

        } catch (error) {
            console.error(`${routeName} Historical Data Error:`, error);
            res.status(500).json({ error: error.message });
        }
    });
});

module.exports = router; 