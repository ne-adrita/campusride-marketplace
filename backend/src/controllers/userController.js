import { db, findUserById, sanitizeUser } from '../data/store.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/users/:id  (public profile)
export const getUserById = asyncHandler(async (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(sanitizeUser(user));
});

// GET /api/users/:id/listings
export const getUserListings = asyncHandler(async (req, res) => {
  res.json(db.products.filter((p) => p.seller_id === req.params.id));
});

// GET /api/users/stats  (auth) - dashboard numbers for the logged-in user
export const getDashboardStats = asyncHandler(async (req, res) => {
  const myId = req.user.user_id;
  const unread = db.messages.filter((m) => m.receiver_id === myId).length; // simple stand-in; no read/unread flag yet

  res.json({
    activeListings: db.products.filter((p) => p.seller_id === myId).length,
    ridesOffered: db.rides.filter((r) => r.driver_id === myId).length,
    unreadMessages: unread,
    rating: req.user.rating_avg || 0,
  });
});

// PUT /api/users/profile  (auth)
export const updateProfile = asyncHandler(async (req, res) => {
  const user = findUserById(req.user.user_id);
  const { name, phone, bio, avatar } = req.body;
  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  res.json(sanitizeUser(user));
});
