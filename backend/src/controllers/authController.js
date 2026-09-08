import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/auth/register  (requires a valid, university-domain Firebase ID
// token - see requireFirebaseToken middleware). Firebase already created the
// actual account (email/password, verification, etc); this just creates the
// matching CampusRide profile document in MongoDB.
export const register = asyncHandler(async (req, res) => {
  const { name, studentId } = req.body;
  if (!name || !studentId) {
    return res.status(400).json({ message: 'name and studentId are required' });
  }

  if (await User.findOne({ firebaseUid: req.firebaseUid })) {
    return res.status(409).json({ message: 'A profile for this account already exists' });
  }

  const user = await User.create({
    firebaseUid: req.firebaseUid,
    name,
    email: req.firebaseEmail,
    studentId,
    verified: false, // new accounts start unverified; an admin verifies them
    role: 'student',
  });

  res.status(201).json({ user: user.toJSON() });
});

// GET /api/auth/me  (requires `protect` middleware, which sets req.user)
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});
