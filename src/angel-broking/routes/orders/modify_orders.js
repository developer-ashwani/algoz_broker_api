const express = require('express');
const router = express.Router();
const { angelAuth } = require('../../config/angel');

// Apply Angel authentication middleware
router.use(angelAuth);

// Constants for validation
const VALID_VARIETIES = ['NORMAL', 'STOPLOSS', 'ROBO'];
const VALID_ORDER_TYPES = ['MARKET', 'LIMIT', 'STOPLOSS_LIMIT', 'STOPLOSS_MARKET'];
const VALID_PRODUCT_TYPES = ['DELIVERY', 'CARRYFORWARD', 'MARGIN', 'INTRADAY', 'BO'];
const VALID_DURATIONS = ['DAY', 'IOC'];
const VALID_EXCHANGES = ['BSE', 'NSE', 'NFO', 'MCX', 'BFO', 'CDS'];

// Modify order
router.post('/', async (req, res) => {
    try {
        const {
            variety,
            orderid,
            ordertype,
            producttype,
            duration,
            price,
            quantity,
            tradingsymbol,
            symboltoken,
            exchange
        } = req.body;

        // Validate required fields
        if (!variety || !orderid || !ordertype || !producttype || 
            !duration || !quantity) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields',
                required: [
                    'variety', 'orderid', 'ordertype', 'producttype',
                    'duration', 'quantity'
                ]
            });
        }

        // Validate enums
        if (!VALID_VARIETIES.includes(variety)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid variety',
                valid_varieties: VALID_VARIETIES
            });
        }

        if (!VALID_ORDER_TYPES.includes(ordertype)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid order type',
                valid_order_types: VALID_ORDER_TYPES
            });
        }

        if (!VALID_PRODUCT_TYPES.includes(producttype)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid product type',
                valid_product_types: VALID_PRODUCT_TYPES
            });
        }

        if (!VALID_DURATIONS.includes(duration)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid duration',
                valid_durations: VALID_DURATIONS
            });
        }

        if (exchange && !VALID_EXCHANGES.includes(exchange)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid exchange',
                valid_exchanges: VALID_EXCHANGES
            });
        }

        // Validate price for LIMIT orders
        if (ordertype === 'LIMIT' && !price) {
            return res.status(400).json({
                status: 'error',
                message: 'Price is required for LIMIT orders'
            });
        }

        // Validate quantity
        if (isNaN(quantity) || parseInt(quantity) <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid quantity. Must be a positive number'
            });
        }

        // Prepare modify order parameters
        const modifyParams = {
            variety,
            orderid,
            ordertype,
            producttype,
            duration,
            quantity: quantity.toString()
        };

        // Add optional parameters if provided
        if (price) modifyParams.price = price.toString();
        if (tradingsymbol) modifyParams.tradingsymbol = tradingsymbol;
        if (symboltoken) modifyParams.symboltoken = symboltoken;
        if (exchange) modifyParams.exchange = exchange;

        // Modify order using SmartAPI
        const response = await req.angel.smartApi.modifyOrder(modifyParams);

        res.json({
            status: response.status,
            message: response.message,
            data: {
                orderid: response.data?.orderid,
                uniqueorderid: response.data?.uniqueorderid
            }
        });

    } catch (error) {
        console.error('Modify Order Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to modify order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
