const express = require('express');
const router = express.Router();
const { initializeUpstox, UpstoxClient } = require('../config/upstox');

// Initialize API instances
const client = initializeUpstox();
const marketApi = new UpstoxClient.MarketQuoteApi();

// Get market quotes for instruments
router.get('/quotes', async (req, res) => {
    try {
        const symbol = req.query.symbol || "NSE_EQ|INE528G01035"; // Default symbol
        
        marketApi.getMarketQuoteOHLC({ symbol }, (error, data, response) => {
            if (error) {
                console.error('API Error:', error);
                return res.status(500).json({ error: error.message });
            }
            res.json(data);
        });
    } catch (error) {
        console.error('Route Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Example of websocket connection for live market data
router.post('/stream', async (req, res) => {
    try {
        const { symbols } = req.body;
        const streamer = new UpstoxClient.MarketDataStreamer();
        
        streamer.on('open', () => {
            console.log('WebSocket Connected');
            streamer.subscribe(symbols, 'full');
        });

        streamer.on('message', (data) => {
            console.log('Market Data:', data.toString('utf-8'));
        });

        streamer.connect();
        
        res.json({ message: 'Streaming started' });
    } catch (error) {
        console.error('Streaming Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
