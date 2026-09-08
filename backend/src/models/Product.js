import mongoose from 'mongoose';
import { idField } from '../utils/toJSONId.js';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  price: { type: Number, required: true }, // stored in USD, same as the original mock data
  condition: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  category_id: { type: String, default: null },
  image: { type: String, default: null },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller_name: { type: String, required: true },
  seller_rating: { type: Number, default: 0 },
  seller_verified: { type: Boolean, default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

productSchema.set('toJSON', idField('product_id'));

export default mongoose.model('Product', productSchema);
