const express = require('express');
const router = express.Router();
const { fyersAuth } = require('../../config/fyers');

// Apply Fyers authentication middleware
router.use(fyersAuth);

// Place order
router.post('/', async (req, res) => {
    try {
        const {
            symbol,
            qty,
            type,
            side,
            productType,
            limitPrice = 0,
            stopPrice = 0,
            disclosedQty = 0,
            validity = 'DAY',
            offlineOrder = false,
            stopLoss = 0,
            takeProfit = 0,
            orderTag
        } = req.body;

        // Validate required fields
        if (!symbol || !qty || !type || !side || !productType) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'symbol, qty, type, side, and productType are required',
                timestamp: new Date().toISOString()
            });
        }

        // Validate order type
        const validTypes = [1, 2, 3, 4];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Order Type',
                message: 'type must be one of: 1 (Limit), 2 (Market), 3 (Stop), 4 (Stoplimit)',
                timestamp: new Date().toISOString()
            });
        }

        // Validate side
        if (side !== 1 && side !== -1) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Side',
                message: 'side must be either 1 (Buy) or -1 (Sell)',
                timestamp: new Date().toISOString()
            });
        }

        // Validate product type
        const validProductTypes = ['CNC', 'INTRADAY', 'MARGIN', 'CO', 'BO', 'MTF'];
        if (!validProductTypes.includes(productType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Product Type',
                message: 'productType must be one of: ' + validProductTypes.join(', '),
                timestamp: new Date().toISOString()
            });
        }

        // Validate validity
        if (validity !== 'IOC' && validity !== 'DAY') {
            return res.status(400).json({
                success: false,
                error: 'Invalid Validity',
                message: 'validity must be either "IOC" or "DAY"',
                timestamp: new Date().toISOString()
            });
        }

        // Prepare request body
        const reqBody = {
            symbol,
            qty,
            type,
            side,
            productType,
            limitPrice,
            stopPrice,
            disclosedQty,
            validity,
            offlineOrder,
            stopLoss,
            takeProfit
        };

        // Add orderTag if provided
        if (orderTag) {
            reqBody.orderTag = orderTag;
        }

        const orderResponse = await req.fyers.place_order(reqBody);
        
        if (orderResponse.s === 'ok') {
            res.json({
                success: true,
                code: orderResponse.code,
                message: orderResponse.message,
                id: orderResponse.id,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: orderResponse.code,
                error: 'Order Placement Failed',
                message: orderResponse.message || 'Failed to place order',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Order Placement Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Place multiple orders
router.post('/multi', async (req, res) => {
    try {
        const orders = req.body;

        // Validate that orders is an array
        if (!Array.isArray(orders)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Request Format',
                message: 'Request body must be an array of orders',
                timestamp: new Date().toISOString()
            });
        }

        // Validate maximum number of orders
        if (orders.length > 10) {
            return res.status(400).json({
                success: false,
                error: 'Too Many Orders',
                message: 'Maximum 10 orders can be placed simultaneously',
                timestamp: new Date().toISOString()
            });
        }

        // Validate each order
        for (const order of orders) {
            const {
                symbol,
                qty,
                type,
                side,
                productType,
                limitPrice = 0,
                stopPrice = 0,
                disclosedQty = 0,
                validity = 'DAY',
                offlineOrder = false,
                stopLoss = 0,
                takeProfit = 0
            } = order;

            // Validate required fields
            if (!symbol || !qty || !type || !side || !productType) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing Required Fields',
                    message: 'Each order must have symbol, qty, type, side, and productType',
                    timestamp: new Date().toISOString()
                });
            }

            // Validate order type
            const validTypes = [1, 2, 3, 4];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Order Type',
                    message: 'type must be one of: 1 (Limit), 2 (Market), 3 (Stop), 4 (Stoplimit)',
                    timestamp: new Date().toISOString()
                });
            }

            // Validate side
            if (side !== 1 && side !== -1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Side',
                    message: 'side must be either 1 (Buy) or -1 (Sell)',
                    timestamp: new Date().toISOString()
                });
            }

            // Validate product type
            const validProductTypes = ['CNC', 'INTRADAY', 'MARGIN', 'CO', 'BO', 'MTF'];
            if (!validProductTypes.includes(productType)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Product Type',
                    message: 'productType must be one of: ' + validProductTypes.join(', '),
                    timestamp: new Date().toISOString()
                });
            }

            // Validate validity
            if (validity !== 'IOC' && validity !== 'DAY') {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Validity',
                    message: 'validity must be either "IOC" or "DAY"',
                    timestamp: new Date().toISOString()
                });
            }
        }

        const orderResponse = await req.fyers.place_multi_order(orders);
        
        if (orderResponse.s === 'ok') {
            res.json({
                success: true,
                code: orderResponse.code,
                message: orderResponse.message,
                data: orderResponse.data,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: orderResponse.code,
                error: 'Multi Order Placement Failed',
                message: orderResponse.message || 'Failed to place orders',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Multi Order Placement Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
