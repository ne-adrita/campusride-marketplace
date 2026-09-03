import bcrypt from 'bcryptjs';
import { db, findUserByEmail, sanitizeUser } from '../data/store.js';
import { generateToken } from '../utils/generateToken.js';
import { generateId } from '../utils/ids.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, studentId, password } = req.body;

  if (!name || !email || !studentId || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ message: 'An account with this email already exists' });
  }

  // Never store the raw password. bcrypt.hash salts it and hashes it in one
  // step, so even if the data store leaked, passwords aren't recoverable.
  const hashed = await bcrypt.hash(password, 10);

  const user = {
    user_id: generateId('user_'),
    name,
    email,
    password: hashed,
    studentId,
    verified: false, // new accounts start unverified; an admin verifies them
    role: 'student',
    avatar: null,
    phone: '',
    bio: '',
    rating_avg: 0,
    ride_count: 0,
    created_at: new Date().toISOString(),
  };
  db.users.push(user);

  const token = generateToken(user.user_id);
  res.status(201).json({ token, user: sanitizeUser(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = findUserByEmail(email);
  // Same error for "no such user" and "wrong password" - don't leak which one.
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user.user_id);
  res.json({ token, user: sanitizeUser(user) });
});

// GET /api/auth/me  (requires `protect` middleware, which sets req.user)
export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});
