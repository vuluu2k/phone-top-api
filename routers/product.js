import express from 'express';
const router = express.Router();
import productController from '../controllers/productController';

router.get('/view', productController.getProduct);
router.post('/create', productController.createProduct);
router.patch('/edit', productController.editProduct);
router.delete('/delete/:id', productController.deleteProduct);
router.get('/view_home', productController.getProductInHome);

export default router;
