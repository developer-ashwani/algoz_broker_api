const express = require('express');
const router = express.Router();
const aliceblueAPI = require('../../config/aliceblue.api');

/**
 * @route GET /api/aliceblue/user/account-details
 * @desc Get account details for the user
 * @access Private
 */
router.get('/accountDetails', async (req, res) => {
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

        // Get account details using API class
        const accountDetails = await aliceblueAPI.getAccountDetails(token);

        // Send success response
        res.status(200).json({
            success: true,
            data: accountDetails
        });

    } catch (error) {
        console.error('Error fetching account details:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

/**
 * @route GET /api/aliceblue/user/funds
 * @desc Get RMS limits (funds) for the account
 * @access Private
 */
router.get('/funds', async (req, res) => {
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

        // Get RMS limits using API class
        const rmsLimits = await aliceblueAPI.getRmsLimits(token);

        // Send success response
        res.status(200).json({
            success: true,
            data: rmsLimits
        });

    } catch (error) {
        console.error('Error fetching RMS limits:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

module.exports = router;
