import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/admin/users/pending  (auth + admin)
export const getPendingUsers = asyncHandler(async (req, res) => {
  res.json(await User.find({ verified: false }));
});

// PUT /api/admin/users/:userId/verify  (auth + admin)
export const verifyUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.userId, { verified: true }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User verified successfully' });
});
