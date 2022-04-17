import express from 'express';

const router = express.Router();
import cartControlller from '../controllers/cartController';

router.post('/init', cartControlller.initCart);
router.get('/view_cart', cartControlller.getCart);
router.patch('/change', cartControlller.changeCart);

export default router;
