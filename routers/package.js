const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');

router.get('/view_package', packageController.getPackage);
router.get('/check_package', packageController.getCheckPackage);
router.post('/create_package', packageController.createPackage);
router.post('/accept_package', packageController.acceptPackage);
router.delete('/delete_package/:id', packageController.deletePackage);
router.get('/view_turnover', packageController.getTurnover);
router.post('/request_cancel_package', packageController.sendRequest);
router.post('/send_shipper', packageController.sendShipper);

module.exports = router;
