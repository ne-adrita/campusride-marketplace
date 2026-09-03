import { db, findUserById, sanitizeUser } from '../data/store.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// GET /api/admin/users/pending  (auth + admin)
export const getPendingUsers = asyncHandler(async (req, res) => {
  res.json(db.users.filter((u) => !u.verified).map(sanitizeUser));
});

// PUT /api/admin/users/:userId/verify  (auth + admin)
export const verifyUser = asyncHandler(async (req, res) => {
  const user = findUserById(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.verified = true;
  res.json({ message: 'User verified successfully' });
});
