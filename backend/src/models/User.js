import mongoose from 'mongoose';
import { idField } from '../utils/toJSONId.js';

const userSchema = new mongoose.Schema({
  // Links this profile to the Firebase Auth account that owns it. Firebase
  // handles the actual password/identity; this collection only holds the
  // app-specific profile data hung off that identity.
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  studentId: { type: String, required: true },
  verified: { type: Boolean, default: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: { type: String, default: null },
  phone: { type: String, default: '' },
  bio: { type: String, default: '' },
  rating_avg: { type: Number, default: 0 },
  ride_count: { type: Number, default: 0 },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

userSchema.set('toJSON', idField('user_id', { hide: ['firebaseUid', 'wishlist'] }));

export default mongoose.model('User', userSchema);
