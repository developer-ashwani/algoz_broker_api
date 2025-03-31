const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');

// Available intervals for intraday data
const INTRADAY_INTERVALS = {
    '1minute': '1minute',
    '30minute': '30minute'
};

// Validate instrument key format
function isValidInstrumentKey(key) {
    return /^[A-Z]+_[A-Z]+\|[A-Z0-9]+$/.test(key);
}

// Create routes for each interval using loop
Object.entries(INTRADAY_INTERVALS).forEach(([routeName, intervalValue]) => {
    router.get(`/${routeName}`, async (req, res) => {
        try {
            // Use the initialized client from middleware
            const client = req.upstoxClient;
            const historyApi = new UpstoxClient.HistoryApi(client);

            const { instrumentKey } = req.query;

            // Validation
            if (!instrumentKey) {
                return res.status(400).json({ 
                    error: 'instrumentKey is required' 
                });
            }

            if (!isValidInstrumentKey(instrumentKey)) {
                return res.status(400).json({ 
                    error: 'Invalid instrument key format',
                    example: 'NSE_EQ|INE669E01016'
                });
            }

            // Log request for debugging
            console.log(`Fetching ${routeName} Intraday Data:`, {
                instrumentKey,
                interval: intervalValue
            });

            const opts = {
                headers: {
                    'accept': 'application/json',
                    'api-version': '2.0'
                }
            };

            historyApi.getIntraDayCandleData(
                instrumentKey,
                intervalValue,
                opts,
                (error, data, response) => {
                    if (error) {
                        console.error(`Intraday ${routeName} Data Error:`, error);
                        return res.status(500).json({ 
                            error: error.message,
                            details: error.response?.body
                        });
                    }

                    // Format the response
                    res.json({
                        status: 'success',
                        interval: routeName,
                        instrumentKey: instrumentKey,
                        timestamp: new Date().toISOString(),
                        data: data
                    });
                }
            );

        } catch (error) {
            console.error(`Intraday ${routeName} Data Error:`, error);
            res.status(500).json({ 
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    });
});

module.exports = router; 