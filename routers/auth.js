// authRouter

import express from 'express';
const router = express.Router();

import authController from '../controllers/authController';
import { verifyToken } from '../middlewares/token';

router.post('/register', authController.createAuth);
router.post('/login', authController.loginAuth);
router.get('/', verifyToken, authController.checkAuth);
router.get('/view', authController.getAuth);

export default router;
