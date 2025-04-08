const express = require('express');
const router = express.Router();
const { fyersAuth } = require('../../config/fyers');

// Apply Fyers authentication middleware
router.use(fyersAuth);

// Get historical candle data
router.get('/candle', async (req, res) => {
    try {
        const {
            symbol,
            resolution,
            date_format,
            range_from,
            range_to,
            cont_flag,
            oi_flag
        } = req.query;

        // Validate required fields
        if (!symbol || !resolution || !date_format || !range_from || !range_to || !cont_flag) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'symbol, resolution, date_format, range_from, range_to, and cont_flag are required',
                timestamp: new Date().toISOString()
            });
        }

        // Validate date_format
        if (date_format !== '0' && date_format !== '1') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Date Format',
                message: 'date_format must be either 0 (epoch) or 1 (yyyy-mm-dd)',
                timestamp: new Date().toISOString()
            });
        }

        // Validate resolution
        const validResolutions = [
            'D', '1D', '5S', '10S', '15S', '30S', '45S', '1', '2', '3', '5',
            '10', '15', '20', '30', '60', '120', '240'
        ];
        if (!validResolutions.includes(resolution)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Resolution',
                message: 'resolution must be one of: ' + validResolutions.join(', '),
                timestamp: new Date().toISOString()
            });
        }

        // Prepare request body
        const reqBody = {
            symbol,
            resolution,
            date_format,
            range_from,
            range_to,
            cont_flag
        };

        // Add oi_flag if provided
        if (oi_flag) {
            reqBody.oi_flag = oi_flag;
        }

        const historyResponse = await req.fyers.getHistory(reqBody);
        
        if (historyResponse.s === 'ok') {
            res.json({
                success: true,
                data: {
                    candles: historyResponse.candles
                },
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Historical Data Fetch Failed',
                message: historyResponse.message || 'Failed to fetch historical data',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Historical Data Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
