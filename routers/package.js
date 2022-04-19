import express from 'express';
const router = express.Router();
import packageController from '../controllers/packageController';

router.get('/view_package', packageController.getPackage);
router.post('/create_package', packageController.createPackage);

export default router;
