// API for placing orders
const express = require('express');
const router = express.Router();
const { angelAuth } = require('../../config/angel');

// Apply Angel authentication middleware
router.use(angelAuth);

// Constants for validation
const VALID_VARIETIES = ['NORMAL', 'STOPLOSS', 'ROBO'];
const VALID_TRANSACTION_TYPES = ['BUY', 'SELL'];
const VALID_ORDER_TYPES = ['MARKET', 'LIMIT', 'STOPLOSS_LIMIT', 'STOPLOSS_MARKET'];
const VALID_PRODUCT_TYPES = ['DELIVERY', 'CARRYFORWARD', 'MARGIN', 'INTRADAY', 'BO'];
const VALID_DURATIONS = ['DAY', 'IOC'];
const VALID_EXCHANGES = ['BSE', 'NSE', 'NFO', 'MCX', 'BFO', 'CDS'];

// Place order
router.post('/', async (req, res) => {
    try {
        const {
            variety,
            tradingsymbol,
            symboltoken,
            transactiontype,
            exchange,
            ordertype,
            producttype,
            duration,
            price,
            squareoff = "0",
            stoploss = "0",
            quantity,
            triggerprice,
            disclosedquantity,
            ordertag
        } = req.body;

        // Validate required fields
        if (!variety || !tradingsymbol || !symboltoken || !transactiontype || 
            !exchange || !ordertype || !producttype || !duration || !quantity) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields',
                required: [
                    'variety', 'tradingsymbol', 'symboltoken', 'transactiontype',
                    'exchange', 'ordertype', 'producttype', 'duration', 'quantity'
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

        if (!VALID_TRANSACTION_TYPES.includes(transactiontype)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid transaction type',
                valid_transaction_types: VALID_TRANSACTION_TYPES
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

        if (!VALID_EXCHANGES.includes(exchange)) {
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

        // Validate triggerprice for STOPLOSS orders
        if (ordertype.includes('STOPLOSS') && !triggerprice) {
            return res.status(400).json({
                status: 'error',
                message: 'Trigger price is required for STOPLOSS orders'
            });
        }

        // Validate quantity
        if (isNaN(quantity) || parseInt(quantity) <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid quantity. Must be a positive number'
            });
        }

        // Prepare order parameters
        const orderParams = {
            variety,
            tradingsymbol,
            symboltoken,
            transactiontype,
            exchange,
            ordertype,
            producttype,
            duration,
            price: price || "0",
            squareoff,
            stoploss,
            quantity: quantity.toString()
        };

        // Add optional parameters if provided
        if (triggerprice) orderParams.triggerprice = triggerprice;
        if (disclosedquantity) orderParams.disclosedquantity = disclosedquantity;
        if (ordertag) orderParams.ordertag = ordertag;

        // Place order using SmartAPI
        const response = await req.angel.smartApi.placeOrder(orderParams);

        res.json({
            status: response.status,
            message: response.message,
            data: {
                script: response.data?.script,
                orderid: response.data?.orderid,
                uniqueorderid: response.data?.uniqueorderid
            }
        });

    } catch (error) {
        console.error('Place Order Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to place order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;
