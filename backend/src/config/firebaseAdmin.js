import admin from 'firebase-admin';

// Verifies the ID tokens the frontend's Firebase Auth SDK issues. This is
// the server-side half of the "Firebase for identity, MongoDB for profile
// data" split: Firebase proves *who* is calling, our own User collection
// (keyed by firebaseUid) holds everything the app actually needs about them.
//
// Initialization is lazy (only happens the first time a request needs it)
// so a missing credential doesn't crash the whole server at boot - it just
// fails the specific auth-dependent request with a clear message, which is
// friendlier while you're still wiring the credential up.
let app;

// Also usable standalone (e.g. from seed.js, which needs admin.auth() to
// create matching Firebase accounts for seeded users) - call this first if
// you're not going through verifyFirebaseToken.
export function initFirebaseAdmin() {
  if (app) return app;

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and ' +
      'FIREBASE_PRIVATE_KEY in backend/.env (from Firebase Console -> Project Settings -> ' +
      'Service Accounts -> Generate new private key).'
    );
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      // .env can't hold real newlines, so the key is stored with literal
      // "\n" sequences and unescaped here.
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
  return app;
}

// Throws if the token is missing/expired/invalid - callers decide how to
// respond (see middleware/auth.js).
export async function verifyFirebaseToken(idToken) {
  return admin.auth(initFirebaseAdmin()).verifyIdToken(idToken);
}

export { admin };
