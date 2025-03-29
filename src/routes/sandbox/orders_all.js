const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../config/upstox');

router.post('/orders', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_SANDBOX_TOKEN;
        const client = initializeUpstox(token, true);
        const orderApi = new UpstoxClient.OrderApi(client);

        // Extract order details from request body
        const {
            quantity,
            product,
            validity,
            price = 0,
            instrument_token,
            order_type,
            transaction_type,
            disclosed_quantity = 0,
            trigger_price = 0,
            is_amo = false,
            tag = "string"
        } = req.body;

        // Validate required fields
        const requiredFields = { quantity, product, validity, instrument_token, order_type, transaction_type };
        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Construct the order request
        const orderRequest = new UpstoxClient.PlaceOrderRequest(
            parseInt(quantity),
            UpstoxClient.PlaceOrderRequest.ProductEnum[product],
            UpstoxClient.PlaceOrderRequest.ValidityEnum[validity],
            parseFloat(price),
            instrument_token,
            UpstoxClient.PlaceOrderRequest.OrderTypeEnum[order_type],
            UpstoxClient.PlaceOrderRequest.TransactionTypeEnum[transaction_type],
            parseInt(disclosed_quantity),
            parseFloat(trigger_price),
            is_amo,
            tag
        );

        // Set API version in headers
        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        // Place the order
        orderApi.placeOrder(orderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Order Placement Error:', error);
                return res.status(error.status || 500).json({
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json(data);
        });

    } catch (error) {
        console.error('Order Placement Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
