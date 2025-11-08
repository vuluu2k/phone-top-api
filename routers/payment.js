const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// ZaloPay routes
router.post('/zalopay/create', paymentController.createZaloPayPayment);
router.post('/zalopay/callback', paymentController.zaloPayCallback);
router.get('/zalopay/query', paymentController.queryZaloPayStatus);

module.exports = router;
