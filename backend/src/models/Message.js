import mongoose from 'mongoose';
import { idField } from '../utils/toJSONId.js';

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
}, { timestamps: { createdAt: 'sent_at', updatedAt: false } });

messageSchema.set('toJSON', idField('message_id'));

export default mongoose.model('Message', messageSchema);
