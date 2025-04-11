// Api for profile, funds and logout.

// src/fyers/routes/Users/user.js

const express = require('express');
const router = express.Router();
const { fyersAuth } = require('../../config/fyers');

// Apply Fyers authentication middleware
router.use(fyersAuth);

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        // Using the fyers instance attached in the auth middleware
        const profileResponse = await req.fyers.get_profile();

        // Check if the response is successful
        if (profileResponse.code === 200) {
            res.json({
                success: true,
                code: profileResponse.code,
                data: profileResponse.data,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: profileResponse.code,
                error: 'Profile Fetch Failed',
                message: profileResponse.message || 'Unable to fetch profile data',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message || 'Failed to fetch profile data',
            timestamp: new Date().toISOString()
        });
    }
});

// Get user funds
router.get('/funds', async (req, res) => {
    try {
        const fundsResponse = await req.fyers.get_funds();

        if (fundsResponse.code === 200) {
            res.json({
                success: true,
                code: fundsResponse.code,
                data: fundsResponse.fund_limit,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: fundsResponse.code,
                error: 'Funds Fetch Failed',
                message: fundsResponse.message || 'Unable to fetch funds data',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Funds Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message || 'Failed to fetch funds data',
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;