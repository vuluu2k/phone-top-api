import express from 'express';
const router = express.Router();
import commentController from '../controllers/commentController';

router.get('/', commentController.getComment);
router.post('/', commentController.createComment);
router.patch('/', commentController.editComment);
router.delete('/', commentController.deleteComment);

export default router;
