import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Ride from '../models/Ride.js';
import Message from '../models/Message.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/users/:id  (public profile)
export const getUserById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'User not found' });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// GET /api/users/:id/listings
export const getUserListings = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.json([]);
  res.json(await Product.find({ seller_id: req.params.id }));
});

// GET /api/users/stats  (auth) - dashboard numbers for the logged-in user
export const getDashboardStats = asyncHandler(async (req, res) => {
  const myId = req.user.user_id;
  const [activeListings, ridesOffered, unreadMessages] = await Promise.all([
    Product.countDocuments({ seller_id: myId }),
    Ride.countDocuments({ driver_id: myId }),
    Message.countDocuments({ receiver_id: myId }), // no read/unread flag yet, so this is "received"
  ]);

  res.json({ activeListings, ridesOffered, unreadMessages, rating: req.user.rating_avg || 0 });
});

// PUT /api/users/profile  (auth)
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, bio, avatar } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (bio !== undefined) updates.bio = bio;
  if (avatar !== undefined) updates.avatar = avatar;

  const user = await User.findByIdAndUpdate(req.user.user_id, updates, { new: true, runValidators: true });
  res.json(user);
});
