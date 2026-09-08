import { Router } from 'express';
import { register, getMe } from '../controllers/authController.js';
import { protect, requireFirebaseToken } from '../middleware/auth.js';

const router = Router();

// No login route: the frontend's Firebase Auth SDK handles sign-in directly
// (signInWithEmailAndPassword) and never talks to this backend for it.
router.post('/register', requireFirebaseToken, register);
router.get('/me', protect, getMe);

export default router;
