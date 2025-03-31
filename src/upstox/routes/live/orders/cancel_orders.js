const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');
const { initializeUpstox } = require('../../../config/upstox');


// Cancel Order Route
router.delete('/:orderId', async (req, res) => {
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

        // Log request for debugging
        console.log('Cancelling Order:', orderId);

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        orderApi.cancelOrder(orderId, opts, (error, data, response) => {
            if (error) {
                console.error('Cancel Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json({
                message: 'Order cancelled successfully',
                data: data
            });
        });

    } catch (error) {
        console.error('Cancel Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 