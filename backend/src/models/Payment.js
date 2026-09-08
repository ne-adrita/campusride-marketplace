import mongoose from 'mongoose';
import { idField } from '../utils/toJSONId.js';

// Mock payment gateway record - see paymentController.js for why nothing
// here actually talks to Stripe/bKash.
const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  bdtAmount: Number,
  currency: { type: String, default: 'BDT' },
  itemId: { type: String, required: true },
  itemType: { type: String, required: true },
  method: { type: String, required: true },
  provider: String,
  phone: String,
  status: { type: String, default: 'requires_confirmation' },
  clientSecret: String,
  cardLast4: String,
  transactionId: String,
  confirmedAt: Date,
}, { timestamps: { createdAt: 'created', updatedAt: false } });

paymentSchema.set('toJSON', idField('id', { hide: ['user_id'] }));

export default mongoose.model('Payment', paymentSchema);
