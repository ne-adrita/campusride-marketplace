import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

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

// --- Global middleware -----------------------------------------------------
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' })); // lets the Vite dev server (different port) call this API
app.use(express.json()); // parses JSON request bodies into req.body
app.use(morgan('dev')); // logs "GET /api/products 200 12ms" per request - handy while learning

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
