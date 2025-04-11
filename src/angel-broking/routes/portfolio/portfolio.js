// API for Position, Tradebook, orderbook and holdings.
const express = require('express');
const router = express.Router();
const { angelAuth } = require('../../config/angel');

// Apply Angel authentication middleware
router.use(angelAuth);

// Get holdings
router.get('/holdings', async (req, res) => {
    try {
        const holdings = await req.angel.smartApi.getHolding();
        res.json({
            status: 'success',
            message: 'Holdings fetched successfully',
            data: holdings
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch holdings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all holdings
router.get('/holdings/all', async (req, res) => {
    try {
        const allHoldings = await req.angel.smartApi.getAllHolding();
        res.json({
            status: 'success',
            message: 'All holdings fetched successfully',
            data: allHoldings
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch all holdings',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get positions
router.get('/positions', async (req, res) => {
    try {
        const positions = await req.angel.smartApi.getPosition();
        res.json({
            status: 'success',
            message: 'Positions fetched successfully',
            data: positions
        });
        console.log(positions);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch positions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get trade book
router.get('/tradebook', async (req, res) => {
    try {
        const tradebook = await req.angel.smartApi.getTradeBook();
        res.json({
            status: 'success',
            message: 'Trade book fetched successfully',
            data: tradebook.data
        });
    } catch (error) {
        console.error('Trade Book Error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch trade book'
        });
    }
});

// Convert position
router.post('/positions/convert', async (req, res) => {
    try {
        const {
            exchange,
            oldproducttype,
            newproducttype,
            tradingsymbol,
            transactiontype,
            quantity,
            type = 'DAY'
        } = req.body;

        // Validate required fields
        if (!exchange || !oldproducttype || !newproducttype || !tradingsymbol || !transactiontype || !quantity) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields',
                required: ['exchange', 'oldproducttype', 'newproducttype', 'tradingsymbol', 'transactiontype', 'quantity']
            });
        }

        const result = await req.angel.smartApi.convertPosition({
            exchange,
            oldproducttype,
            newproducttype,
            tradingsymbol,
            transactiontype,
            quantity,
            type
        });

        res.json({
            status: 'success',
            message: 'Position converted successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Failed to convert position',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;