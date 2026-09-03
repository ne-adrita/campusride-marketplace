import jwt from 'jsonwebtoken';

// A JWT is just a signed JSON blob: { payload }.signature. Anyone can read the
// payload (it's only base64, not encrypted) but only someone holding
// JWT_SECRET can produce a signature that verifies - that's what makes it
// trustworthy. We keep the payload tiny (just the user id).
export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
