import express from 'express';

const router = express.Router();
import layoutControlller from '../controllers/layoutController';

router.get('/view_layout', layoutControlller.getLayout);
router.post('/create_layout', layoutControlller.createLayout);
router.delete('/delete_layout/:id', layoutControlller.deleteLayout);
router.patch('/edit_layout', layoutControlller.editLayout);

export default router;
