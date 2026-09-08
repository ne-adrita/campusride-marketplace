import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Sits behind a platform load balancer (Render/Railway/etc.) in production,
// so req.ip / rate-limiting read the real client IP from X-Forwarded-For.
if (isProd) app.set('trust proxy', 1);

// --- Global middleware -----------------------------------------------------
app.use(helmet()); // sets a bunch of protective HTTP headers (no XSS-sniffing, no clickjacking framing, etc.)
app.use(compression()); // gzip responses

// CLIENT_ORIGIN can be a single URL or a comma-separated list (e.g. your
// deployed frontend + a preview URL). No origin header (curl, mobile apps,
// server-to-server) is allowed through since it isn't a browser CORS case.
const allowedOrigins = (process.env.CLIENT_ORIGIN || '*').split(',').map((o) => o.trim());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
}));

app.use(express.json({ limit: '1mb' })); // parses JSON request bodies into req.body
app.use(mongoSanitize()); // strips $ and . from user input so it can't be interpreted as a Mongo operator
app.use(morgan(isProd ? 'combined' : 'dev')); // request logging

// Auth endpoints are the classic brute-force target, so they get a tighter limit
// than the rest of the API.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false });
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// --- Health check ------------------------------------------------------------
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// --- Feature routes, each mounted under /api/... ----------------------------
// This mirrors exactly what frontend/src/services/*.js call.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);

// --- 404 + error handling, must be registered last --------------------------
app.use(notFound);
app.use(errorHandler);

export default app;
