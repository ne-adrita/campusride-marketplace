import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.post('/', protect, createProduct);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/wishlist', protect, addToWishlist);
router.delete('/:id/wishlist', protect, removeFromWishlist);

export default router;
