const express = require('express');

const router = express.Router();
const cartControlller = require('../controllers/cartController');

router.post('/init', cartControlller.initCart);
router.get('/view_cart', cartControlller.getCart);
router.patch('/change', cartControlller.changeCart);

module.exports = router;
