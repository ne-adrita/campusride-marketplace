import { Router } from 'express';
import {
  createPaymentIntent,
  confirmCardPayment,
  processMobileBanking,
  getPayments,
  getPaymentById,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect); // payments always require a logged-in user

router.post('/intent', createPaymentIntent);
router.post('/mobile', processMobileBanking);
router.post('/:paymentId/confirm', confirmCardPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);

export default router;
