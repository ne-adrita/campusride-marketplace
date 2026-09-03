import { Router } from 'express';
import { getWishlist } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getWishlist);

export default router;
