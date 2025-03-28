const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');

// Middleware to check if user is authenticated
const authMiddleware = (req, res, next) => {
    const accessToken = req.session.accessToken;
    if (!accessToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userService = new UserService(accessToken);
    next();
};

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const profile = await req.userService.getProfile();
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get portfolio
router.get('/portfolio', authMiddleware, async (req, res) => {
    try {
        const portfolio = await req.userService.getPortfolio();
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get orders
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await req.userService.getOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 