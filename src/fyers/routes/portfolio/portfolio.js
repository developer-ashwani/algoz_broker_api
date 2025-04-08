// Position, Tradebook and holdings.

const express = require('express');
const router = express.Router();
const { fyersAuth } = require('../../config/fyers');

// Apply Fyers authentication middleware
router.use(fyersAuth);


// Get positions
router.get('/positions', async (req, res) => {
    try {
        const positionsResponse = await req.fyers.get_positions();
        
        if (positionsResponse.code === 200) {
            res.json({
                success: true,
                code: positionsResponse.code,
                data: {
                    netPositions: positionsResponse.netPositions,
                    overall: positionsResponse.overall
                },
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: positionsResponse.code,
                error: 'Positions Fetch Failed',
                message: positionsResponse.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Positions Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});


// Convert position
router.put('/position', async (req, res) => {
    try {
        const {
            symbol,
            positionSide,
            convertQty,
            convertFrom,
            convertTo,
            overnight
        } = req.body;

        // Validate required fields
        if (!symbol || !positionSide || !convertQty || !convertFrom || !convertTo) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'symbol, positionSide, convertQty, convertFrom, and convertTo are required',
                timestamp: new Date().toISOString()
            });
        }

        const reqBody = {
            symbol,
            positionSide,
            convertQty,
            convertFrom,
            convertTo,
            overnight: overnight || 1
        };

        const convertResponse = await req.fyers.convert_position(reqBody);
        
        if (convertResponse.code === 200) {
            res.json({
                success: true,
                code: convertResponse.code,
                message: convertResponse.message,
                data: {
                    positionDetails: convertResponse.positionDetails
                },
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: convertResponse.code,
                error: 'Position Conversion Failed',
                message: convertResponse.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Position Conversion Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Delete position
router.delete('/position', async (req, res) => {
    try {
        const { id, exit_all } = req.body;

        // Validate that either id or exit_all is provided
        if (!id && !exit_all) {
            return res.status(400).json({
                success: false,
                error: 'Missing Required Fields',
                message: 'Either id or exit_all must be provided',
                timestamp: new Date().toISOString()
            });
        }

        // Prepare request body based on provided parameters
        const reqBody = id ? { id } : { exit_all: 1 };

        const exitResponse = await req.fyers.exit_position(reqBody);
        
        if (exitResponse.code === 200) {
            res.json({
                success: true,
                code: exitResponse.code,
                message: exitResponse.message,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: exitResponse.code,
                error: 'Position Exit Failed',
                message: exitResponse.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Position Exit Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get tradebook
router.get('/tradebook', async (req, res) => {
    try {
        const tradebookResponse = await req.fyers.get_tradebook();
        
        if (tradebookResponse.code === 200) {
            res.json({
                success: true,
                code: tradebookResponse.code,
                data: tradebookResponse.tradeBook,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                code: tradebookResponse.code,
                error: 'Tradebook Fetch Failed',
                message: tradebookResponse.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Tradebook Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Get holdings
router.get('/holdings', async (req, res) => {
    try {
        const holdingsResponse = await req.fyers.get_holdings();
        
        if (holdingsResponse.code === 200) {
            res.json({
                success: true,
                code: holdingsResponse.code,
                data: {
                    overall: holdingsResponse.overall,
                    holdings: holdingsResponse.holdings
                },
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Holdings Fetch Failed',
                message: holdingsResponse.message,
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Holdings Fetch Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;


