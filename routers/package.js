import express from 'express';
const router = express.Router();
import packageController from '../controllers/packageController';

router.get('/view_package', packageController.getPackage);
router.get('/check_package', packageController.getCheckPackage);
router.post('/create_package', packageController.createPackage);
router.post('/accept_package', packageController.acceptPackage);
router.delete('/delete_package/:id', packageController.deletePackage);
router.get('/view_turnover', packageController.getTurnover);

export default router;
