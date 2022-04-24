// authRouter

import express from 'express';
const router = express.Router();

import authController from '../controllers/authController';
import { verifyToken } from '../middlewares/token';

router.post('/register', authController.createAuth);
router.post('/login', authController.loginAuth);
router.patch('/edit_auth', authController.editAuth);
router.get('/', verifyToken, authController.checkAuth);
router.get('/view_auth', authController.getAuth);
router.delete('/delete_auth/:id', authController.deleteUser);

export default router;
