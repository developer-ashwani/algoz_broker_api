const express = require('express');
const router = express.Router();
const webSocketService = require('../../services/websocket.service');

// Connect route
router.post('/connect', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        if (webSocketService.isConnected) {
            return res.status(200).json({ message: 'WebSocket already connected' });
        }

        webSocketService.initialize(token);
        await webSocketService.connect();

        res.json({ status: 'success', message: 'WebSocket connected successfully' });
    } catch (error) {
        console.error("Connect Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Subscribe route
router.post('/subscribe', async (req, res) => {
    try {
        if (!webSocketService.isConnected) {
            return res.status(400).json({ error: 'WebSocket not connected' });
        }

        const { instruments, mode = "full" } = req.body;
        if (!Array.isArray(instruments) || instruments.length === 0) {
            return res.status(400).json({ error: 'Invalid instruments array' });
        }

        webSocketService.subscribe(instruments, mode);
        res.json({ status: 'success', message: 'Successfully subscribed to market data', instruments });
    } catch (error) {
        console.error("Subscribe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Change subscription mode
router.put('/mode', async (req, res) => {
    try {
        if (!webSocketService.isConnected) {
            return res.status(400).json({ error: 'WebSocket not connected' });
        }

        const { instruments, mode } = req.body;
        if (!Array.isArray(instruments) || instruments.length === 0 || !mode) {
            return res.status(400).json({ error: 'Invalid request parameters' });
        }

        webSocketService.changeMode(instruments, mode);
        res.json({ status: 'success', message: 'Mode changed successfully', instruments, mode });
    } catch (error) {
        console.error('Mode Change Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Unsubscribe route
router.post('/unsubscribe', async (req, res) => {
    try {
        if (!webSocketService.isConnected) {
            return res.status(400).json({ error: 'WebSocket not connected' });
        }

        const { instruments } = req.body;
        if (!Array.isArray(instruments) || instruments.length === 0) {
            return res.status(400).json({ error: 'Invalid instruments array' });
        }

        webSocketService.unsubscribe(instruments);
        res.json({ status: 'success', message: 'Successfully unsubscribed from market data', instruments });
    } catch (error) {
        console.error("Unsubscribe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Disconnect route
router.post('/disconnect', async (req, res) => {
    try {
        if (!webSocketService.isConnected) {
            return res.status(400).json({ error: 'WebSocket not connected' });
        }

        webSocketService.disconnect();
        res.json({ status: 'success', message: 'WebSocket disconnected successfully' });
    } catch (error) {
        console.error("Disconnect Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get WebSocket URL route
router.get('/url', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const url = await webSocketService.getMarketDataFeedUrl(token);
        res.json({ status: 'success', url });
    } catch (error) {
        console.error("URL Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
