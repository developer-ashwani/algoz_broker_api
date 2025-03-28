const express = require('express');
const router = express.Router();
const upstoxAuth = require('../config/auth');

// Redirect user to Upstox login
router.get('/login', (req, res) => {
    const loginUrl = upstoxAuth.getLoginUrl();
    res.redirect(loginUrl);
});

// Handle OAuth callback
router.get('/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const tokenData = await upstoxAuth.getAccessToken(code);
        
        // Store token in session or send to client
        req.session.accessToken = tokenData.access_token;
        
        res.json({ message: 'Authentication successful', token: tokenData });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 