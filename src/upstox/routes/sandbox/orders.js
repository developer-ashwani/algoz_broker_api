const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../config/upstox');

// Place Delivery Market Order endpoint
router.post('/deliveryMarketOrder', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true); // true for sandbox mode
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate required fields
        const requiredFields = ['quantity', 'product', 'validity', 'instrument_token', 'order_type', 'transaction_type'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }

        // Create order request using the constructor with proper enums
        const orderRequest = new UpstoxClient.PlaceOrderRequest(
            parseInt(req.body.quantity),
            UpstoxClient.PlaceOrderRequest.ProductEnum[req.body.product],
            UpstoxClient.PlaceOrderRequest.ValidityEnum[req.body.validity],
            parseFloat(req.body.price || 0),
            req.body.instrument_token,
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum[req.body.order_type],
            UpstoxClient.PlaceOrderRequest.TransactionTypeEnum[req.body.transaction_type],
            parseInt(req.body.disclosed_quantity || 0),
            parseFloat(req.body.trigger_price || 0),
            req.body.is_amo || false
        );

        // Set API version in headers
        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Order Request:', orderRequest);

        // Place the order
        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Sandbox Order Error:', error);
                return res.status(error.status || 500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Sandbox Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Place Delivery Limit Order endpoint
router.post('/deliveryLimitOrder', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate required fields
        const requiredFields = ['quantity', 'product', 'validity', 'price', 'instrument_token', 'transaction_type'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }

        // Create limit order request using the constructor
        const orderRequest = new UpstoxClient.PlaceOrderRequest(
            parseInt(req.body.quantity),
            UpstoxClient.PlaceOrderRequest.ProductEnum[req.body.product],
            UpstoxClient.PlaceOrderRequest.ValidityEnum[req.body.validity],
            parseFloat(req.body.price),
            req.body.instrument_token,
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum.LIMIT,  // Always LIMIT for this endpoint
            UpstoxClient.PlaceOrderRequest.TransactionTypeEnum[req.body.transaction_type],
            parseInt(req.body.disclosed_quantity || 0),
            parseFloat(req.body.trigger_price || 0),
            req.body.is_amo || false
        );

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Limit Order Request:', orderRequest);

        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Sandbox Limit Order Error:', error);
                return res.status(error.status || 500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Sandbox Limit Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delivery Stop-Loss Order
router.post('/deliveryStopLossOrder', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate required fields
        const requiredFields = ['quantity', 'product', 'validity', 'price', 'instrument_token', 'transaction_type', 'trigger_price'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }

        const orderRequest = new UpstoxClient.PlaceOrderRequest(
            parseInt(req.body.quantity),
            UpstoxClient.PlaceOrderRequest.ProductEnum[req.body.product],
            UpstoxClient.PlaceOrderRequest.ValidityEnum[req.body.validity],
            parseFloat(req.body.price),
            req.body.instrument_token,
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum.SL,
            UpstoxClient.PlaceOrderRequest.TransactionTypeEnum[req.body.transaction_type],
            parseInt(req.body.disclosed_quantity || 0),
            parseFloat(req.body.trigger_price),
            req.body.is_amo || false
        );

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Stop-Loss Order Request:', orderRequest);

        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Stop-Loss Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Stop-Loss Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delivery Stop-Loss Market Order
router.post('/deliveryStopLossOrderMarket', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate required fields
        const requiredFields = ['quantity', 'product', 'validity', 'instrument_token', 'transaction_type', 'trigger_price'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }

        const orderRequest = new UpstoxClient.PlaceOrderRequest(
            parseInt(req.body.quantity),
            UpstoxClient.PlaceOrderRequest.ProductEnum[req.body.product],
            UpstoxClient.PlaceOrderRequest.ValidityEnum[req.body.validity],
            parseFloat(req.body.price || 0),
            req.body.instrument_token,
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum.SL_M,  // Changed to SL_M for Stop Loss Market
            UpstoxClient.PlaceOrderRequest.TransactionTypeEnum[req.body.transaction_type],
            parseInt(req.body.disclosed_quantity || 0),
            parseFloat(req.body.trigger_price),
            req.body.is_amo || false
        );

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Stop-Loss Market Order Request:', orderRequest);

        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Stop-Loss Market Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Stop-Loss Market Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Intraday Market Order
router.post('/intradayMarketOrder', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate required fields
        const requiredFields = ['quantity', 'product', 'validity', 'instrument_token', 'transaction_type'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }

        const orderRequest = new UpstoxClient.PlaceOrderRequest(
            parseInt(req.body.quantity),
            UpstoxClient.PlaceOrderRequest.ProductEnum.I,  // I for Intraday
            UpstoxClient.PlaceOrderRequest.ValidityEnum[req.body.validity],
            parseFloat(req.body.price || 0),
            req.body.instrument_token,
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum.MARKET,
            UpstoxClient.PlaceOrderRequest.TransactionTypeEnum[req.body.transaction_type],
            parseInt(req.body.disclosed_quantity || 0),
            parseFloat(req.body.trigger_price || 0),
            req.body.is_amo || false
        );

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Intraday Market Order Request:', orderRequest);

        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Intraday Market Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Intraday Market Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Intraday Limit Order
router.post('/intradayLimitOrder', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate required fields
        const requiredFields = ['quantity', 'product', 'validity', 'price', 'instrument_token', 'transaction_type'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }

        const orderRequest = new UpstoxClient.PlaceOrderRequest(
            parseInt(req.body.quantity),
            UpstoxClient.PlaceOrderRequest.ProductEnum.I,  // I for Intraday
            UpstoxClient.PlaceOrderRequest.ValidityEnum[req.body.validity],
            parseFloat(req.body.price),
            req.body.instrument_token,
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum.LIMIT,
            UpstoxClient.PlaceOrderRequest.TransactionTypeEnum[req.body.transaction_type],
            parseInt(req.body.disclosed_quantity || 0),
            parseFloat(req.body.trigger_price || 0),
            req.body.is_amo || false
        );

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Log request for debugging
        console.log('Intraday Limit Order Request:', orderRequest);

        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Intraday Limit Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Intraday Limit Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 