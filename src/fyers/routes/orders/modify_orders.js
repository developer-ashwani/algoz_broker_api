const express = require('express');
const router = express.Router();
const { fyersAuth } = require('../../config/fyers');

// Apply Fyers authentication middleware
router.use(fyersAuth);

// Modify order
router.patch('/', async (req, res) => {
    try {
        const {
            id,
            type,
            limitPrice,
            stopPrice,
            qty,
            disclosedQty,
            side,
            offlineOrder = false
        } = req.body;

        // Validate required fields
        if (!id) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'id is required',
                timestamp: new Date().toISOString()
            });
        }

        // Validate that at least one modification parameter is provided
        if (!type && !limitPrice && !stopPrice && !qty) {
            return res.status(400).json({
                success: false,
                error: 'Missing Modification Parameters',
                message: 'At least one of type, limitPrice, stopPrice, or qty must be provided',
                timestamp: new Date().toISOString()
            });
        }

        // Validate order type if provided
        if (type) {
            const validTypes = [1, 2, 3, 4];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Order Type',
                    message: 'type must be one of: 1 (Limit), 2 (Market), 3 (Stop), 4 (Stoplimit)',
                    timestamp: new Date().toISOString()
                });
            }
        }

        // Validate side if provided
        if (side && side !== 1 && side !== -1) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Side',
                message: 'side must be either 1 (Buy) or -1 (Sell)',
                timestamp: new Date().toISOString()
            });
        }

        // Prepare request body
        const reqBody = {
            id,
            offlineOrder
        };

        // Add optional fields if provided
        if (type) reqBody.type = type;
        if (limitPrice !== undefined) reqBody.limitPrice = limitPrice;
        if (stopPrice !== undefined) reqBody.stopPrice = stopPrice;
        if (qty) reqBody.qty = qty;
        if (disclosedQty !== undefined) reqBody.disclosedQty = disclosedQty;
        if (side) reqBody.side = side;

        const modifyResponse = await req.fyers.modify_order(reqBody);
        
        if (modifyResponse.s === 'ok') {
            res.json({
                success: true,
                code: modifyResponse.code,
                message: modifyResponse.message,
                id: modifyResponse.id,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: modifyResponse.code,
                error: 'Order Modification Failed',
                message: modifyResponse.message || 'Failed to modify order',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Order Modification Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Modify multiple orders
router.patch('/multi', async (req, res) => {
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
                message: 'Maximum 10 orders can be modified simultaneously',
                timestamp: new Date().toISOString()
            });
        }

        // Validate each order
        for (const order of orders) {
            const {
                id,
                type,
                limitPrice,
                stopPrice,
                qty,
                disclosedQty,
                side,
                offlineOrder = false
            } = order;

            // Validate required fields
            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing Required Fields',
                    message: 'id is required for each order',
                    timestamp: new Date().toISOString()
                });
            }

            // Validate that at least one modification parameter is provided
            if (!type && !limitPrice && !stopPrice && !qty) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing Modification Parameters',
                    message: 'At least one of type, limitPrice, stopPrice, or qty must be provided for each order',
                    timestamp: new Date().toISOString()
                });
            }

            // Validate order type if provided
            if (type) {
                const validTypes = [1, 2, 3, 4];
                if (!validTypes.includes(type)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid Order Type',
                        message: 'type must be one of: 1 (Limit), 2 (Market), 3 (Stop), 4 (Stoplimit)',
                        timestamp: new Date().toISOString()
                    });
                }
            }

            // Validate side if provided
            if (side && side !== 1 && side !== -1) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Side',
                    message: 'side must be either 1 (Buy) or -1 (Sell)',
                    timestamp: new Date().toISOString()
                });
            }
        }

        const modifyResponse = await req.fyers.modify_multi_order(orders);
        
        if (modifyResponse.s === 'ok') {
            res.json({
                success: true,
                code: modifyResponse.code,
                message: modifyResponse.message,
                data: modifyResponse.data,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: modifyResponse.code,
                error: 'Multi Order Modification Failed',
                message: modifyResponse.message || 'Failed to modify orders',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Multi Order Modification Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
