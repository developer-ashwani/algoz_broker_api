const express = require('express');
const router = express.Router();
const aliceblueAPI = require('../../config/aliceblue.api');

/**
 * @route POST /api/aliceblue/orders/modify
 * @desc Modify an existing order
 * @access Private
 */
router.post('/', async (req, res) => {
    try {
        // Get authorization header from request
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header is required'
            });
        }

        // Extract token from Authorization header
        // Format: "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization token format'
            });
        }

        // Get order details from request body
        const order = req.body;

        // Validate required fields
        const requiredFields = [
            'transtype',
            'discqty',
            'exch',
            'trading_symbol',
            'nestOrderNumber',
            'prctyp',
            'price',
            'qty',
            'trigPrice',
            'filledQuantity',
            'pCode',
            'deviceNumber'
        ];

        const missingFields = requiredFields.filter(field => !order[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                missingFields
            });
        }

        // Validate exchange
        const validExchanges = ['NSE', 'BSE', 'NFO', 'MCX'];
        if (!validExchanges.includes(order.exch)) {
            return res.status(400).json({
                success: false,
                message: `Invalid exchange. Must be one of: ${validExchanges.join(', ')}`
            });
        }

        // Validate transaction type
        const validTransTypes = ['BUY', 'SELL'];
        if (!validTransTypes.includes(order.transtype)) {
            return res.status(400).json({
                success: false,
                message: `Invalid transaction type. Must be one of: ${validTransTypes.join(', ')}`
            });
        }

        // Validate price type
        const validPriceTypes = ['L', 'MKT', 'SL', 'SL-M'];
        if (!validPriceTypes.includes(order.prctyp)) {
            return res.status(400).json({
                success: false,
                message: `Invalid price type. Must be one of: ${validPriceTypes.join(', ')}`
            });
        }

        // Validate product code
        const validProductCodes = ['MIS', 'CO', 'CNC', 'BO', 'NRML'];
        if (!validProductCodes.includes(order.pCode)) {
            return res.status(400).json({
                success: false,
                message: `Invalid product code. Must be one of: ${validProductCodes.join(', ')}`
            });
        }

        // Modify order using API class
        const response = await aliceblueAPI.modifyOrder(order, token);

        // Send success response
        res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error('Error modifying order:', error);
        
        // Send error response
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: error.data
        });
    }
});

module.exports = router;
