const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');

// Create a variable to store the WebSocket instance
let webSocket = null;

// Initialize Upstox client
function initializeUpstox(token) {
    let defaultClient = UpstoxClient.ApiClient.instance;
    let apiVersion = "2.0";
    let OAUTH2 = defaultClient.authentications["OAUTH2"];
    OAUTH2.accessToken = token;
    return defaultClient;
}

// Connect route
router.post('/connect', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        // Initialize Upstox client
        let defaultClient = UpstoxClient.ApiClient.instance;
        defaultClient.authentications["OAUTH2"].accessToken = token;
        
        // Get the market data feed URL first
        let apiInstance = new UpstoxClient.WebsocketApi();
        
        apiInstance.getMarketDataFeedAuthorize(
            "2.0", // apiVersion
            async (error, data, response) => {
                if (error) {
                    console.error("Error getting WebSocket URL:", error);
                    return res.status(500).json({ error: error.message });
                }

                try {
                    // Create new streamer instance
                    const streamer = new UpstoxClient.MarketDataStreamerV3();
                    webSocket = streamer;

                    // Setup event handlers before connecting
                    streamer.on("open", () => {
                        console.log("WebSocket Connected");
                    });

                    streamer.on("message", (data) => {
                        console.log("Market Update:", data.toString());
                    });

                    streamer.on("error", (error) => {
                        console.error("WebSocket Error:", error);
                    });

                    streamer.on("close", () => {
                        console.log("WebSocket Connection Closed");
                    });

                    // Connect to WebSocket
                    streamer.connect();

                    res.json({ 
                        status: 'success', 
                        message: 'WebSocket connected successfully'
                    });

                } catch (err) {
                    console.error("Connection Error:", err);
                    res.status(500).json({ error: err.message });
                }
            }
        );

    } catch (error) {
        console.error("Connect Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Subscribe route
router.post('/subscribe', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        if (!webSocket) {
            // If no WebSocket exists, try to create a new connection
            const streamer = new UpstoxClient.MarketDataStreamerV3();
            
            // Initialize Upstox client with token
            let defaultClient = UpstoxClient.ApiClient.instance;
            defaultClient.authentications["OAUTH2"].accessToken = token;
            
            webSocket = streamer;
            streamer.connect();

            // Wait for connection to be established
            streamer.on("open", () => {
                const { instruments, mode = "full" } = req.body;
                if (!instruments || !Array.isArray(instruments)) {
                    return res.status(400).json({ error: 'Invalid instruments array' });
                }

                streamer.subscribe(instruments, mode);
                console.log("Subscribed to instruments:", instruments);
                res.json({ 
                    status: 'success', 
                    message: 'Successfully subscribed to market data',
                    instruments: instruments
                });
            });

            streamer.on("error", (error) => {
                console.error("WebSocket Error:", error);
                res.status(500).json({ error: 'WebSocket connection error' });
            });

        } else {
            // If WebSocket exists, just subscribe
            const { instruments, mode = "full" } = req.body;
            if (!instruments || !Array.isArray(instruments)) {
                return res.status(400).json({ error: 'Invalid instruments array' });
            }

            webSocket.subscribe(instruments, mode);
            console.log("Subscribed to instruments:", instruments);
            res.json({ 
                status: 'success', 
                message: 'Successfully subscribed to market data',
                instruments: instruments
            });
        }

    } catch (error) {
        console.error("Subscribe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Change subscription mode
router.put('/mode', (req, res) => {
    try {
        const { instruments, mode } = req.body;
        
        if (!instruments || !Array.isArray(instruments) || !mode) {
            return res.status(400).json({ error: 'Invalid request parameters' });
        }

        webSocketService.changeMode(instruments, mode);
        res.json({ 
            message: 'Mode changed successfully',
            instruments,
            mode
        });
    } catch (error) {
        console.error('Mode Change Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Unsubscribe route
router.post('/unsubscribe', async (req, res) => {
    try {
        if (!webSocket) {
            return res.status(400).json({ error: 'WebSocket not connected' });
        }

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authorization token required' });
        }

        const { instruments } = req.body;
        if (!instruments || !Array.isArray(instruments)) {
            return res.status(400).json({ error: 'Invalid instruments array' });
        }

        // Make sure the WebSocket is still connected
        if (webSocket.readyState !== WebSocket.OPEN) {
            return res.status(400).json({ error: 'WebSocket connection is not open' });
        }

        webSocket.unsubscribe(instruments);
        console.log("Unsubscribed from instruments:", instruments);
        res.json({ 
            status: 'success', 
            message: 'Successfully unsubscribed from market data',
            instruments: instruments
        });

    } catch (error) {
        console.error("Unsubscribe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Disconnect route
router.post('/disconnect', async (req, res) => {
    try {
        if (!webSocket) {
            return res.status(400).json({ error: 'WebSocket not connected' });
        }

        webSocket.disconnect();
        webSocket = null;
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

        // Initialize Upstox client
        initializeUpstox(token);
        
        // Initialize a Websocket API instance
        let apiInstance = new UpstoxClient.WebsocketApi();
        
        // Get the market data feed URL
        apiInstance.getMarketDataFeedAuthorize(
            "2.0", // apiVersion
            (error, data, response) => {
                if (error) {
                    console.error("Error getting WebSocket URL:", error);
                    return res.status(500).json({ error: error.message });
                }
                res.json({ 
                    status: 'success', 
                    url: data.data.authorizedRedirectUri 
                });
            }
        );

    } catch (error) {
        console.error("URL Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 