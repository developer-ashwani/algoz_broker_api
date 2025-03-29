const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../../config/upstox');

// Get Order Status by Order ID
router.get('/status/:orderId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate order ID
        const orderId = req.params.orderId;
        if (!orderId) {
            return res.status(400).json({ 
                error: 'Order ID is required' 
            });
        }

        const opts = {
            orderId: orderId,
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Getting Order Status for Order ID:', orderId);

        orderApi.getOrderStatus(opts, (error, data, response) => {
            if (error) {
                console.error('Order Status Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Order Status Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Order Book (all orders)
router.get('/book', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        orderApi.getOrderBook(opts, (error, data, response) => {
            if (error) {
                console.error('Order Book Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Order Book Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Order History by Order ID
router.get('/orderHistory/:orderId', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate order ID
        const orderId = req.params.orderId;
        if (!orderId) {
            return res.status(400).json({ 
                error: 'Order ID is required' 
            });
        }

        const opts = {
            orderId: orderId,
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Getting Order History for Order ID:', orderId);

        orderApi.getOrderDetails(opts, (error, data, response) => {
            if (error) {
                console.error('Order History Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Order History Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 