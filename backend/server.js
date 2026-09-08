import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to the database FIRST, then start accepting requests - this way
// the server never serves a request it can't actually fulfill, and any
// misconfigured MONGO_URI fails loudly at boot instead of on the first
// request a user happens to make.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`CampusRide API running on http://localhost:${PORT}`);
      console.log(`Try it: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
