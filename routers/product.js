const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/view', productController.getProduct);
router.post('/create', productController.createProduct);
router.patch('/edit', productController.editProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.get('/view_home', productController.getProductInHome);
router.get('/:id', productController.getProductItem);

module.exports = router;
