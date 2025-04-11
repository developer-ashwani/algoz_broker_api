// Api for profile, funds and logout.

const express = require('express');
const router = express.Router();
const { angelAuth } = require('../../config/angel');

// Apply Fyers authentication middleware
router.use(angelAuth);

// Get user profile
router.get('/profile', async (req, res) => {
    try {
        // req.angel is the smartApi instance attached in middleware
        const profile = await req.angel.smartApi.getProfile();
        res.json({
            status: 'success',
            message: 'Profile fetched successfully',
            data: profile
        });
        console.log(profile);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get user funds/RMS limits
router.get('/funds', async (req, res) => {
    try {
        const rms = await req.angel.smartApi.getRMS();
        res.json({
            status: 'success',
            message: 'Funds fetched successfully',
            data: rms
        });
        console.log(rms);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch funds',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Logout user
router.post('/logout', async (req, res) => {
    try {
        const client_code = req.body.clientcode;
        const logout = await req.angel.smartApi.logout(client_code);
        res.json({
            data: logout
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;