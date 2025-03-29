const express = require('express');
const router = express.Router();

router.use('/orders', require('./place_orders'));
router.use('/profile', require('./profile'));
router.use('/portfolio', require('./portfolio'));
router.use('/getOrders', require('./get_orders'));
router.use('/cancelOrders', require('./cancel_orders'));

module.exports = router; 