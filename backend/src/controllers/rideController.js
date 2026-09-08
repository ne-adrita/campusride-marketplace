import mongoose from 'mongoose';
import Ride from '../models/Ride.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const BDT_RATE = 120;

// GET /api/rides?search=&origin=&destination=&date=&maxPrice=&sort=&page=&limit=
export const getRides = asyncHandler(async (req, res) => {
  const { search, origin, destination, date, maxPrice, sort, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) filter.$or = [{ origin: new RegExp(escapeRegex(search), 'i') }, { destination: new RegExp(escapeRegex(search), 'i') }];
  if (origin) filter.origin = new RegExp(escapeRegex(origin), 'i');
  if (destination) filter.destination = new RegExp(escapeRegex(destination), 'i');
  if (date) filter.date_time = new RegExp('^' + escapeRegex(date));
  if (maxPrice) filter.fare_per_seat = { $lte: Number(maxPrice) / BDT_RATE };

  let sortSpec = { date_time: 1 };
  if (sort === 'price_asc' || sort === 'price_low') sortSpec = { fare_per_seat: 1 };
  else if (sort === 'price_desc' || sort === 'price_high') sortSpec = { fare_per_seat: -1 };

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [rides, total] = await Promise.all([
    Ride.find(filter).sort(sortSpec).skip((pageNum - 1) * limitNum).limit(limitNum),
    Ride.countDocuments(filter),
  ]);

  res.json({ rides, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
});

// GET /api/rides/:id
export const getRideById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Ride not found' });
  const ride = await Ride.findById(req.params.id);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  res.json(ride);
});

// POST /api/rides  (auth)
export const createRide = asyncHandler(async (req, res) => {
  const { origin, destination, date_time, seats_total, fare_per_seat, vehicle_details, notes } = req.body;
  if (!origin || !destination || !date_time || !seats_total || fare_per_seat === undefined) {
    return res.status(400).json({ message: 'origin, destination, date_time, seats_total and fare_per_seat are required' });
  }

  const ride = await Ride.create({
    origin,
    destination,
    date_time,
    seats_total: Number(seats_total),
    seats_available: Number(seats_total),
    fare_per_seat: Number(fare_per_seat),
    vehicle_details: vehicle_details || '',
    notes: notes || '',
    driver_id: req.user.user_id,
    driver_name: req.user.name,
    driver_rating: req.user.rating_avg || 0,
    status: 'active',
  });
  res.status(201).json(ride);
});

// PUT /api/rides/:id  (auth + must be the driver)
export const updateRide = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Ride not found' });
  const ride = await Ride.findById(req.params.id);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  if (ride.driver_id.toString() !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only edit your own rides' });
  }

  const fields = ['origin', 'destination', 'date_time', 'fare_per_seat', 'vehicle_details', 'notes', 'status'];
  fields.forEach((f) => { if (req.body[f] !== undefined) ride[f] = req.body[f]; });
  await ride.save();
  res.json(ride);
});

// DELETE /api/rides/:id  (auth + must be the driver)
export const deleteRide = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Ride not found' });
  const ride = await Ride.findById(req.params.id);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  if (ride.driver_id.toString() !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only delete your own rides' });
  }
  await ride.deleteOne();
  res.json({ message: 'Ride deleted' });
});

// POST /api/rides/:id/book  (auth)
export const bookRide = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Ride not found' });
  const ride = await Ride.findById(req.params.id);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  if (ride.driver_id.toString() === req.user.user_id) {
    return res.status(400).json({ message: 'You cannot book your own ride' });
  }
  const seats = Number(req.body.seats) || 1;

  // Atomic update guards against two people booking the last seat at once.
  const updated = await Ride.findOneAndUpdate(
    { _id: ride._id, seats_available: { $gte: seats } },
    { $inc: { seats_available: -seats } },
    { new: true }
  );
  if (!updated) return res.status(400).json({ message: 'Not enough seats available' });
  res.json({ message: 'Ride booked successfully!' });
});

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
