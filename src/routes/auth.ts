import express from 'express';
import { loginUser, registerUser, getMe, updateProfile } from '@/controllers/authController';
import { protect } from '@/middleware/auth';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router; 