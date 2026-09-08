import dns from 'node:dns';
import mongoose from 'mongoose';

// Node's bundled DNS resolver (c-ares) sometimes can't resolve the SRV/TXT
// records an `mongodb+srv://` URI needs when it's pointed at a home router's
// DNS server - even though the OS resolver (nslookup) handles it fine. This
// is a well-known Node/Windows quirk, not a problem with the connection
// string. Pointing Node at a public resolver just for this fixes it.
dns.setServers(['8.8.8.8', '1.1.1.1', ...dns.getServers()]);

// Connects once at startup. server.js awaits this before app.listen so the
// app never accepts a request it can't actually serve.
export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set - add it to backend/.env');
  }

  mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err.message));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
}
