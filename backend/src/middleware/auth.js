import jwt from 'jsonwebtoken';
import { findUserById, sanitizeUser } from '../data/store.js';

// Runs in front of any route that requires a logged-in user.
// Expects: Authorization: Bearer <token>  (added automatically by the
// frontend's axios interceptor - see frontend/src/api/axios.js).
export function protect(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user no longer exists' });
    }
    req.user = sanitizeUser(user); // available to every downstream handler
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
}

// Chain after `protect` on routes only admins should reach.
export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}
