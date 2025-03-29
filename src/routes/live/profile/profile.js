const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../../config/upstox');

router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const userApi = new UpstoxClient.UserApi(client);
        userApi.getProfile({ headers: { 'api-version': '2.0' } }, (error, data, response) => {
            if (error) {
                console.error('Live Profile Error:', error);
                return res.status(500).json({ error: error.message });
            }
            res.json(data);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 