const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../../config/upstox');

// Get option contracts without expiry date
router.get('/contracts/:instrumentKey', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const optionsApi = new UpstoxClient.OptionsApi(client);
        const instrumentKey = req.params.instrumentKey;

        // Log request for debugging
        console.log('Getting Option Contracts for:', instrumentKey);

        optionsApi.getOptionContracts(instrumentKey, null, (error, data, response) => {
            if (error) {
                console.error('Option Contracts Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Option Contracts Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get option contracts with expiry date
router.get('/contracts/:instrumentKey/:expiryDate', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const optionsApi = new UpstoxClient.OptionsApi(client);
        const { instrumentKey, expiryDate } = req.params;

        const opts = {
            'expiryDate': expiryDate
        };

        // Log request for debugging
        console.log('Getting Option Contracts for:', instrumentKey, 'Expiry:', expiryDate);

        optionsApi.getOptionContracts(instrumentKey, opts, (error, data, response) => {
            if (error) {
                console.error('Option Contracts Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Option Contracts Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get put/call option chain
router.get('/chain/:instrumentKey/:expiryDate', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const optionsApi = new UpstoxClient.OptionsApi(client);
        const { instrumentKey, expiryDate } = req.params;

        // Log request for debugging
        console.log('Getting Option Chain for:', instrumentKey, 'Expiry:', expiryDate);

        optionsApi.getPutCallOptionChain(instrumentKey, expiryDate, (error, data, response) => {
            if (error) {
                console.error('Option Chain Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Option Chain Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 