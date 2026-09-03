import { Router } from 'express';
import { getUserById, getUserListings, getDashboardStats, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Specific routes before the generic "/:id" so "/stats" and "/profile"
// aren't swallowed as if they were a user id.
router.get('/stats', protect, getDashboardStats);
router.put('/profile', protect, updateProfile);
router.get('/:id', getUserById);
router.get('/:id/listings', getUserListings);

export default router;
