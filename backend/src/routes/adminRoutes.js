import { Router } from 'express';
import { getPendingUsers, verifyUser } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, adminOnly); // every admin route requires login AND role === 'admin'

router.get('/users/pending', getPendingUsers);
router.put('/users/:userId/verify', verifyUser);

export default router;
