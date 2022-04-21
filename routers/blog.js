import express from 'express';
const router = express.Router();
import blogController from '../controllers/blogController';

router.get('/view_blog', blogController.getBlog);
router.post('/create_blog', blogController.createBlog);
router.patch('/edit_blog', blogController.editBlog);
router.delete('/delete_blog/:id', blogController.deleteBlog);

export default router;
