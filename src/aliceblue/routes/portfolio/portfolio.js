const express = require('express');
const router = express.Router();
const aliceblueAPI = require('../../config/aliceblue.api');

/**
 * @route GET /api/aliceblue/portfolio/holdings
 * @desc Get holdings for the account
 * @access Private
 */
router.get('/holdings', async (req, res) => {
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

        // Get holdings using API class
        const holdings = await aliceblueAPI.getHoldings(token);

        // Send success response
        res.status(200).json({
            success: true,
            data: holdings
        });

    } catch (error) {
        console.error('Error fetching holdings:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

/**
 * @route POST /api/aliceblue/portfolio/positions
 * @desc Get position book for the account
 * @access Private
 */
router.post('/positions', async (req, res) => {
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

        // Get ret parameter from request body
        const { ret = "DAY" } = req.body;

        // Get position book using API class
        const positionBook = await aliceblueAPI.getPositionBook(token, ret);

        // Send success response
        res.status(200).json({
            success: true,
            data: positionBook
        });

    } catch (error) {
        console.error('Error fetching position book:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

/**
 * @route GET /api/aliceblue/portfolio/tradebook
 * @desc Get trade book for the account
 * @access Private
 */
router.get('/tradebook', async (req, res) => {
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

        // Get trade book using API class
        const tradeBook = await aliceblueAPI.getTradeBook(token);

        // Send success response
        res.status(200).json({
            success: true,
            data: tradeBook
        });

    } catch (error) {
        console.error('Error fetching trade book:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

module.exports = router;
