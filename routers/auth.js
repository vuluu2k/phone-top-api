// authRouter

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/token');

router.post('/register', authController.createAuth);
router.post('/login', authController.loginAuth);
router.patch('/edit_auth', authController.editAuth);
router.get('/', verifyToken, authController.checkAuth);
router.get('/view_auth', authController.getAuth);
router.delete('/delete_auth/:id', authController.deleteUser);

module.exports = router;
