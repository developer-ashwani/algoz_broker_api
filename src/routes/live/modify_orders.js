const express = require('express');
const router = express.Router();
const UpstoxClient = require('upstox-js-sdk');

// Initialize Upstox client
function initializeUpstox(token) {
    const defaultClient = UpstoxClient.ApiClient.instance;
    const oauth2 = defaultClient.authentications['OAUTH2'];
    oauth2.accessToken = token;
    return defaultClient;
}

// Modify Order Route
router.put('/modify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || process.env.UPSTOX_LIVE_TOKEN;
        const client = initializeUpstox(token);
        
        const orderApi = new UpstoxClient.OrderApi(client);

        // Validate required fields
        const { 
            orderId,
            quantity,
            orderType,
            price,
            triggerPrice,
            validity,
            disclosedQuantity 
        } = req.body;

        if (!orderId) {
            return res.status(400).json({ 
                error: 'Order ID is required' 
            });
        }

        // Create modify order request
        const modifyOrderRequest = new UpstoxClient.ModifyOrderRequest(
            validity || UpstoxClient.ModifyOrderRequest.ValidityEnum.DAY,
            quantity || 0,
            orderId,
            orderType || UpstoxClient.ModifyOrderRequest.OrderTypeEnum.MARKET,
            price || 0,
            triggerPrice || 0,
            disclosedQuantity || 0
        );

        // Log request for debugging
        console.log('Modifying Order:', {
            orderId,
            orderType,
            quantity,
            price,
            triggerPrice,
            validity,
            disclosedQuantity
        });

        const opts = {
            headers: {
                'accept': 'application/json',
                'api-version': '2.0'
            }
        };

        orderApi.modifyOrder(modifyOrderRequest, opts, (error, data, response) => {
            if (error) {
                console.error('Modify Order Error:', error);
                return res.status(500).json({ 
                    error: error.message,
                    details: error.response?.body
                });
            }
            res.json({
                message: 'Order modified successfully',
                data: data
            });
        });

    } catch (error) {
        console.error('Modify Order Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 