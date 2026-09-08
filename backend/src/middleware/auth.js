import { verifyFirebaseToken } from '../config/firebaseAdmin.js';
import User from '../models/User.js';

const ALLOWED_EMAIL_DOMAIN = '@northsouth.edu';

// Every protected request carries a Firebase ID token, not one we issued
// ourselves: Authorization: Bearer <firebase-id-token>. The frontend's axios
// interceptor attaches it automatically via auth.currentUser.getIdToken()
// (see frontend/src/api/axios.js).
async function decodeRequestToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    const err = new Error('Not authorized, no token');
    err.statusCode = 401;
    throw err;
  }
  let decoded;
  try {
    decoded = await verifyFirebaseToken(header.split(' ')[1]);
  } catch (err) {
    const wrapped = new Error(
      err.message?.startsWith('Firebase Admin is not configured')
        ? err.message
        : 'Not authorized, invalid or expired token'
    );
    wrapped.statusCode = err.message?.startsWith('Firebase Admin is not configured') ? 500 : 401;
    throw wrapped;
  }

  // The frontend's own @northsouth.edu check is just UX - anyone calling
  // this API directly could skip it entirely, so it has to be enforced here
  // too, against the email Firebase itself vouches for for this token
  // (decoded.email), not anything the client claims in the request body.
  if (!decoded.email || !decoded.email.toLowerCase().endsWith(ALLOWED_EMAIL_DOMAIN)) {
    const err = new Error(`Access restricted to ${ALLOWED_EMAIL_DOMAIN} accounts`);
    err.statusCode = 403;
    throw err;
  }

  return decoded;
}

// Use on routes where the caller must already have a CampusRide profile
// (i.e. everywhere except registration, which is what *creates* it).
export async function protect(req, res, next) {
  try {
    const decoded = await decodeRequestToken(req);
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      return res.status(404).json({ message: 'No CampusRide profile for this account yet - finish registration first' });
    }
    req.user = user.toJSON();
    req.firebaseUid = decoded.uid;
    next();
  } catch (err) {
    res.status(err.statusCode || 401).json({ message: err.message });
  }
}

// Use only on registration: proves the caller owns a real, university-domain
// Firebase account without requiring a CampusRide profile to already exist.
export async function requireFirebaseToken(req, res, next) {
  try {
    const decoded = await decodeRequestToken(req);
    req.firebaseUid = decoded.uid;
    req.firebaseEmail = decoded.email;
    next();
  } catch (err) {
    res.status(err.statusCode || 401).json({ message: err.message });
  }
}

// Chain after `protect` on routes only admins should reach.
export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}
