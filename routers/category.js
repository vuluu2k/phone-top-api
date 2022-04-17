import express from 'express';

const router = express.Router();
import categoryControlller from '../controllers/categoryController';

router.get('/view', categoryControlller.getCategory);
router.post('/create', categoryControlller.createCategory);
router.delete('/delete/:id', categoryControlller.deleteCategory);
router.patch('/edit/:id', categoryControlller.editCategory);

export default router;
