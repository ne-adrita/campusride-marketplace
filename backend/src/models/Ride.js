import mongoose from 'mongoose';
import { idField } from '../utils/toJSONId.js';

const rideSchema = new mongoose.Schema({
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date_time: { type: String, required: true }, // ISO string, matches what the frontend sends/reads
  seats_total: { type: Number, required: true },
  seats_available: { type: Number, required: true },
  fare_per_seat: { type: Number, required: true },
  vehicle_details: { type: String, default: '' },
  notes: { type: String, default: '' },
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver_name: { type: String, required: true },
  driver_rating: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
});

rideSchema.set('toJSON', idField('ride_id'));

export default mongoose.model('Ride', rideSchema);
