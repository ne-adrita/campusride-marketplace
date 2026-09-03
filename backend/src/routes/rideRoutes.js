import { Router } from 'express';
import {
  getRides,
  getRideById,
  createRide,
  updateRide,
  deleteRide,
  bookRide,
} from '../controllers/rideController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getRides);
router.post('/', protect, createRide);
router.get('/:id', getRideById);
router.put('/:id', protect, updateRide);
router.delete('/:id', protect, deleteRide);
router.post('/:id/book', protect, bookRide);

export default router;
