import express from 'express';

const router = express.Router();
import categoryControlller from '../controllers/categoryController';

router.get('/', categoryControlller.getCategory);
router.post('/', categoryControlller.createCategory);

export default router;
