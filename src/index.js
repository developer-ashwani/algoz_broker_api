const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const UpstoxClient = require('upstox-js-sdk');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Upstox clients for both environments
const initializeUpstox = (token, isSandbox = false) => {
    const client = isSandbox ? new UpstoxClient.ApiClient(true) : new UpstoxClient.ApiClient();
    client.authentications['OAUTH2'].accessToken = token;
    
    // Set default headers properly
    client.defaultHeaders = {
        'Accept': 'application/json',
        'api-version': '2.0'  // Changed from 'Api-Version' to 'api-version'
    };
    
    return client;
};

// Live routes
app.get('/api/live/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const userApi = new UpstoxClient.UserApi(client);
        const opts = { headers: { 'api-version': '2.0' } };  // Changed header name
        
        userApi.getProfile(opts, (error, data, response) => {
            if (error) {
                console.error('Live Profile Error:', error);
                return res.status(500).json({ error: error.message });
            }
            res.json(data);
        });
    } catch (error) {
        console.error('Live Profile Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// Live Orders
app.post('/api/live/orders', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Map the request parameters to what the API expects
        const orderRequest = {
            side: req.body.transaction_type,          // API expects 'side' instead of 'transaction_type'
            instrumentKey: req.body.instrument_token, // API expects 'instrumentKey' instead of 'instrument_token'
            orderType: req.body.order_type,          // API expects 'orderType' instead of 'order_type'
            quantity: req.body.quantity,
            product: req.body.product,
            validity: req.body.validity,
            price: req.body.price,
            tag: req.body.tag,
            triggerPrice: req.body.trigger_price,    // API expects 'triggerPrice' instead of 'trigger_price'
            disclosedQuantity: req.body.disclosed_quantity, // API expects 'disclosedQuantity'
            isAmo: req.body.is_amo                   // API expects 'isAmo' instead of 'is_amo'
        };

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log the request for debugging
        console.log('Order Request:', orderRequest);

        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Live Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });
    } catch (error) {
        console.error('Live Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Sandbox Orders
app.post('/api/sandbox/orders', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        initializeUpstox(token, true);
        
        const orderApi = new UpstoxClient.OrderApi();
        const orderRequest = new UpstoxClient.PlaceOrderRequest();
        // Set order parameters from request body
        Object.assign(orderRequest, req.body);

        orderApi.placeOrder(orderRequest, (error, data, response) => {
            if (error) {
                console.error('Sandbox Order Error:', error);
                return res.status(500).json({ error: error.message });
            }
            res.json(data);
        });
    } catch (error) {
        console.error('Sandbox Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Live Portfolio
app.get('/api/live/portfolio', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const portfolioApi = new UpstoxClient.PortfolioApi(client);
        const opts = { headers: { 'api-version': '2.0' } };  // Changed header name
        
        portfolioApi.getHoldings(opts, (error, data, response) => {
            if (error) {
                console.error('Live Portfolio Error:', error);
                return res.status(500).json({ error: error.message });
            }
            res.json(data);
        });
    } catch (error) {
        console.error('Live Portfolio Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Sandbox Portfolio
app.get('/api/sandbox/portfolio', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true);
        
        const portfolioApi = new UpstoxClient.PortfolioApi(client);
        const opts = { headers: { 'api-version': '2.0' } };  // Changed header name
        
        portfolioApi.getHoldings(opts, (error, data, response) => {
            if (error) {
                console.error('Sandbox Portfolio Error:', error);
                return res.status(500).json({ error: error.message });
            }
            res.json(data);
        });
    } catch (error) {
        console.error('Sandbox Portfolio Error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 