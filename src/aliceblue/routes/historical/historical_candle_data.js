const express = require('express');
const router = express.Router();
const aliceblueAPI = require('../../config/aliceblue.api');

/**
 * @route POST /api/aliceblue/historical-data
 * @desc Get historical candle data for a given instrument
 * @access Private
 * @param {string} token - The token for the instrument
 * @param {string} resolution - Resolution of data (1 for minute, D for day)
 * @param {string} from - From time in milliseconds (UNIX timestamp)
 * @param {string} to - To time in milliseconds (UNIX timestamp)
 * @param {string} exchange - Exchange segment (NSE, NFO, CDS, MCX)
 */
router.post('/', async (req, res) => {
    try {
        // Get authorization header from request
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header is required'
            });
        }

        // Extract token from Authorization header
        // Format: "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization token format'
            });
        }

        // Get required parameters from request body
        const { token: instrumentToken, resolution, from, to, exchange } = req.body;

        // Validate required parameters
        if (!instrumentToken || !resolution || !from || !to || !exchange) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters. Required: token, resolution, from, to, exchange'
            });
        }

        // Validate resolution
        if (!['1', 'D'].includes(resolution)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid resolution. Must be either "1" (minute) or "D" (day)'
            });
        }

        // Validate exchange
        const validExchanges = ['NSE', 'NFO', 'CDS', 'MCX'];
        if (!validExchanges.includes(exchange)) {
            return res.status(400).json({
                success: false,
                message: `Invalid exchange. Must be one of: ${validExchanges.join(', ')}`
            });
        }

        // Get historical data using API class
        const historicalData = await aliceblueAPI.getHistoricalData(
            instrumentToken,
            resolution,
            from,
            to,
            exchange,
            token
        );

        // Send success response
        res.status(200).json({
            success: true,
            data: historicalData
        });

    } catch (error) {
        console.error('Error fetching historical data:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

module.exports = router; 