import mongoose from 'mongoose';
import { idField } from '../utils/toJSONId.js';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

categorySchema.set('toJSON', idField('category_id'));

export default mongoose.model('Category', categorySchema);
