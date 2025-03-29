const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../config/upstox');

// Single route to handle all order types
router.post('/', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate order type
        const orderType = req.body.order_type;
        if (!orderType) {
            return res.status(400).json({ 
                error: 'order_type is required' 
            });
        }

        // Validate required fields based on order type
        const requiredFields = ['quantity', 'product', 'validity', 'instrument_token', 'transaction_type'];
        
        // Add price requirement for LIMIT and SL orders
        if (['LIMIT', 'SL'].includes(orderType)) {
            requiredFields.push('price');
        }

        // Add trigger_price requirement for SL and SL_M orders
        if (['SL', 'SL_M'].includes(orderType)) {
            requiredFields.push('trigger_price');
        }

        // Validate all required fields
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
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum[orderType],
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
        console.log(`Processing ${orderType} Order Request:`, {
            orderType,
            product: req.body.product,
            quantity: req.body.quantity,
            price: req.body.price,
            triggerPrice: req.body.trigger_price
        });

        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 