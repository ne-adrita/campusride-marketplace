import { db } from '../data/store.js';
import { generateId } from '../utils/ids.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const BDT_RATE = 120;

// GET /api/rides?search=&origin=&destination=&date=&maxPrice=&sort=&page=&limit=
export const getRides = asyncHandler(async (req, res) => {
  const { search, origin, destination, date, maxPrice, sort, page = 1, limit = 20 } = req.query;

  let rides = [...db.rides];

  if (search) {
    const s = String(search).toLowerCase();
    rides = rides.filter((r) => r.origin.toLowerCase().includes(s) || r.destination.toLowerCase().includes(s));
  }
  if (origin) rides = rides.filter((r) => r.origin.toLowerCase().includes(String(origin).toLowerCase()));
  if (destination) rides = rides.filter((r) => r.destination.toLowerCase().includes(String(destination).toLowerCase()));
  if (date) rides = rides.filter((r) => r.date_time.startsWith(date));
  if (maxPrice) rides = rides.filter((r) => Math.round(r.fare_per_seat * BDT_RATE) <= Number(maxPrice));

  if (sort === 'price_asc' || sort === 'price_low') rides.sort((a, b) => a.fare_per_seat - b.fare_per_seat);
  else if (sort === 'price_desc' || sort === 'price_high') rides.sort((a, b) => b.fare_per_seat - a.fare_per_seat);
  else rides.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const total = rides.length;
  const pages = Math.ceil(total / limitNum);
  const paginated = rides.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({ rides: paginated, pagination: { page: pageNum, limit: limitNum, total, pages } });
});

// GET /api/rides/:id
export const getRideById = asyncHandler(async (req, res) => {
  const ride = db.rides.find((r) => r.ride_id === req.params.id);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  res.json(ride);
});

// POST /api/rides  (auth)
export const createRide = asyncHandler(async (req, res) => {
  const { origin, destination, date_time, seats_total, fare_per_seat, vehicle_details, notes } = req.body;
  if (!origin || !destination || !date_time || !seats_total || fare_per_seat === undefined) {
    return res.status(400).json({ message: 'origin, destination, date_time, seats_total and fare_per_seat are required' });
  }

  const ride = {
    ride_id: generateId('ride_'),
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
  };
  db.rides.unshift(ride);
  res.status(201).json(ride);
});

// PUT /api/rides/:id  (auth + must be the driver)
export const updateRide = asyncHandler(async (req, res) => {
  const ride = db.rides.find((r) => r.ride_id === req.params.id);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  if (ride.driver_id !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only edit your own rides' });
  }
  Object.assign(ride, req.body);
  res.json(ride);
});

// DELETE /api/rides/:id  (auth + must be the driver)
export const deleteRide = asyncHandler(async (req, res) => {
  const idx = db.rides.findIndex((r) => r.ride_id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Ride not found' });
  if (db.rides[idx].driver_id !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only delete your own rides' });
  }
  db.rides.splice(idx, 1);
  res.json({ message: 'Ride deleted' });
});

// POST /api/rides/:id/book  (auth)
export const bookRide = asyncHandler(async (req, res) => {
  const ride = db.rides.find((r) => r.ride_id === req.params.id);
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  if (ride.driver_id === req.user.user_id) {
    return res.status(400).json({ message: 'You cannot book your own ride' });
  }
  const seats = Number(req.body.seats) || 1;
  if (ride.seats_available < seats) {
    return res.status(400).json({ message: 'Not enough seats available' });
  }
  ride.seats_available -= seats;
  res.json({ message: 'Ride booked successfully!' });
});
