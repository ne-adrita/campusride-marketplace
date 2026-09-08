// One-time (or repeatable) demo-data loader. NOT run automatically on
// server boot - run it yourself with `npm run seed`. Keeping seeding manual
// and separate from server.js means a production deploy never accidentally
// gets fake demo accounts inserted into a real database.
//
// Since Firebase (not Mongo) owns identity now, each demo user needs a real
// Firebase Auth account too - this script creates one per seed user (or
// reuses it if you've already run the seed before) and links it to the
// Mongo profile via firebaseUid. Requires FIREBASE_PROJECT_ID/
// FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY to be set in backend/.env.
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { initFirebaseAdmin, admin } from '../config/firebaseAdmin.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Ride from '../models/Ride.js';
import Message from '../models/Message.js';
import Payment from '../models/Payment.js';

const hoursFromNow = (h) => new Date(Date.now() + h * 3600000);
const hoursAgo = (h) => new Date(Date.now() - h * 3600000);

const DEMO_PASSWORD = 'password123';

// Creates the Firebase Auth account if it doesn't exist yet, otherwise
// reuses it - makes the seed script safe to run more than once.
async function getOrCreateFirebaseUser(email, displayName) {
  try {
    const existing = await admin.auth().getUserByEmail(email);
    return existing.uid;
  } catch (err) {
    if (err.code !== 'auth/user-not-found') throw err;
    const created = await admin.auth().createUser({ email, password: DEMO_PASSWORD, displayName });
    return created.uid;
  }
}

async function seed() {
  initFirebaseAdmin();
  await connectDB();

  console.log('Clearing existing demo collections (Mongo only - Firebase accounts are reused, not deleted)...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Ride.deleteMany({}),
    Message.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  console.log('Creating/linking Firebase Auth accounts + Mongo profiles...');
  const demoUsers = [
    { name: 'Alex Student', email: 'alex@northsouth.edu', studentId: 'STU-2024-042', verified: true, phone: '+1-555-0100', bio: 'CS junior. Love hiking and photography.', rating_avg: 4.8, ride_count: 12, role: 'student' },
    { name: 'Sarah Chen', email: 'sarah@northsouth.edu', studentId: 'STU-2024-015', verified: true, phone: '+1-555-0102', bio: 'Business major, love reading and coffee.', rating_avg: 4.5, ride_count: 8, role: 'student' },
    { name: 'Rafiq Hasan', email: 'rafiq@northsouth.edu', studentId: 'STU-2024-023', verified: false, phone: '+1-555-0103', bio: 'Engineering student. Part-time photographer.', rating_avg: 4.2, ride_count: 5, role: 'student' },
    { name: 'Priya Sharma', email: 'priya@northsouth.edu', studentId: 'STU-2024-008', verified: true, phone: '+1-555-0104', bio: 'Art major. Love painting and music.', rating_avg: 4.9, ride_count: 15, role: 'student' },
    { name: 'Emily Watson', email: 'emily@northsouth.edu', studentId: 'STU-2024-031', verified: true, phone: '+1-555-0105', bio: 'Literature major. Book club organizer.', rating_avg: 4.0, ride_count: 3, role: 'student' },
    { name: 'Campus Admin', email: 'admin@northsouth.edu', studentId: 'STAFF-0001', verified: true, phone: '+1-555-0000', bio: 'Marketplace administrator.', rating_avg: 5.0, ride_count: 0, role: 'admin' },
  ];

  const created = {};
  for (const u of demoUsers) {
    const firebaseUid = await getOrCreateFirebaseUser(u.email, u.name);
    created[u.email] = await User.create({ ...u, firebaseUid });
  }
  const [alex, sarah, rafiq, priya, emily] = ['alex@northsouth.edu', 'sarah@northsouth.edu', 'rafiq@northsouth.edu', 'priya@northsouth.edu', 'emily@northsouth.edu'].map((e) => created[e]);

  console.log('Creating categories...');
  const [catElectronics, catBooks, catFurniture, catClothing, catSports] = await Category.create([
    { name: 'Electronics' }, { name: 'Books' }, { name: 'Furniture' }, { name: 'Clothing' }, { name: 'Sports & Outdoors' }, { name: 'Other' },
  ]);

  console.log('Creating products...');
  const seller = (u) => ({ seller_id: u._id, seller_name: u.name, seller_rating: u.rating_avg, seller_verified: u.verified });
  await Product.create([
    { title: 'MacBook Air M1 (2020)', price: 720, condition: 'Like New', description: 'Used for one semester. Mint condition, original box included.', location: 'NSU Campus', category_id: catElectronics.id, image: 'https://picsum.photos/seed/prod1/600/400', created_at: hoursAgo(2), ...seller(alex) },
    { title: 'Calculus Textbook — Stewart 8th Ed.', price: 25, condition: 'Good', description: 'Some highlights, overall good condition.', location: 'Dhanmondi', category_id: catBooks.id, image: 'https://picsum.photos/seed/prod2/600/400', created_at: hoursAgo(5), ...seller(sarah) },
    { title: 'IKEA Study Desk', price: 65, condition: 'Good', description: 'Adjustable height, sturdy build.', location: 'Bashundhara', category_id: catFurniture.id, image: 'https://picsum.photos/seed/prod3/600/400', created_at: hoursAgo(24), ...seller(rafiq) },
    { title: 'Sony WH-1000XM4 Headphones', price: 190, condition: 'Like New', description: 'Used twice. Amazing noise cancellation.', location: 'Gulshan', category_id: catElectronics.id, image: 'https://picsum.photos/seed/prod4/600/400', created_at: hoursAgo(72), ...seller(priya) },
    { title: 'Yoga Mat Premium 6mm', price: 35, condition: 'Good', description: 'Non-slip, used for 3 months.', location: 'Dhanmondi', category_id: catSports.id, image: 'https://picsum.photos/seed/prod5/600/400', created_at: hoursAgo(48), ...seller(alex) },
    { title: 'Principles of Microeconomics', price: 30, condition: 'Fair', description: 'Worn cover, all pages intact.', location: 'Mohammadpur', category_id: catBooks.id, image: 'https://picsum.photos/seed/prod6/600/400', created_at: hoursAgo(96), ...seller(emily) },
    { title: 'Graphic T-Shirt Bundle (5 pcs)', price: 60, condition: 'Good', description: 'Size M, premium cotton.', location: 'Uttara', category_id: catClothing.id, image: 'https://picsum.photos/seed/prod7/600/400', created_at: hoursAgo(36), ...seller(rafiq) },
    { title: 'iPad Air + Pencil 2nd Gen', price: 550, condition: 'Like New', description: 'M1 chip, great for note-taking.', location: 'Gulshan', category_id: catElectronics.id, image: 'https://picsum.photos/seed/prod8/600/400', created_at: hoursAgo(12), ...seller(sarah) },
    { title: 'Ergonomic Office Chair', price: 120, condition: 'Good', description: 'Adjustable lumbar support.', location: 'Mohammadpur', category_id: catFurniture.id, image: 'https://picsum.photos/seed/prod9/600/400', created_at: hoursAgo(60), ...seller(emily) },
    { title: 'North Face Winter Jacket', price: 150, condition: 'New', description: 'Never worn, wrong size (L, need M).', location: 'Banani', category_id: catClothing.id, image: 'https://picsum.photos/seed/prod10/600/400', created_at: hoursAgo(8), ...seller(priya) },
    { title: 'Arduino Starter Kit', price: 65, condition: 'Good', description: 'Complete with sensors and guide.', location: 'Dhanmondi', category_id: catElectronics.id, image: 'https://picsum.photos/seed/prod11/600/400', created_at: hoursAgo(16), ...seller(alex) },
    { title: 'Spalding Basketball', price: 40, condition: 'Fair', description: 'Indoor/outdoor, some wear.', location: 'Gulshan', category_id: catSports.id, image: 'https://picsum.photos/seed/prod12/600/400', created_at: hoursAgo(84), ...seller(sarah) },
  ]);

  console.log('Creating rides...');
  const driver = (u) => ({ driver_id: u._id, driver_name: u.name, driver_rating: u.rating_avg });
  await Ride.create([
    { origin: 'Dhanmondi 27', destination: 'NSU Campus', date_time: hoursFromNow(4).toISOString(), seats_total: 4, seats_available: 3, fare_per_seat: 3, vehicle_details: 'Toyota Axio, Blue', status: 'active', ...driver(alex) },
    { origin: 'Gulshan 1', destination: 'NSU Campus', date_time: hoursFromNow(6).toISOString(), seats_total: 3, seats_available: 2, fare_per_seat: 4, vehicle_details: 'Honda Civic, White', status: 'active', ...driver(sarah) },
    { origin: 'Uttara Sector 10', destination: 'NSU Campus', date_time: hoursFromNow(28).toISOString(), seats_total: 4, seats_available: 4, fare_per_seat: 5, vehicle_details: 'Toyota Corolla, Silver', status: 'active', ...driver(rafiq) },
    { origin: 'Banani 11', destination: 'NSU Campus', date_time: hoursFromNow(5).toISOString(), seats_total: 3, seats_available: 1, fare_per_seat: 2, vehicle_details: 'Suzuki Swift, Red', status: 'active', ...driver(priya) },
    { origin: 'Mohammadpur', destination: 'Gulshan 2', date_time: hoursFromNow(26).toISOString(), seats_total: 4, seats_available: 4, fare_per_seat: 4, vehicle_details: 'Nissan Sunny, Gray', status: 'active', ...driver(emily) },
    { origin: 'NSU Campus', destination: 'Dhanmondi 27', date_time: hoursFromNow(8).toISOString(), seats_total: 4, seats_available: 2, fare_per_seat: 3, vehicle_details: 'Toyota Axio, Blue', status: 'active', ...driver(alex) },
    { origin: 'NSU Campus', destination: 'Gulshan 1', date_time: hoursFromNow(10).toISOString(), seats_total: 3, seats_available: 0, fare_per_seat: 4, vehicle_details: 'Honda Civic, White', status: 'completed', ...driver(sarah) },
  ]);

  console.log('Creating sample messages...');
  await Message.create([
    { sender_id: sarah._id, receiver_id: alex._id, content: 'Hi! Is the iPad still available?', sent_at: hoursAgo(3) },
    { sender_id: alex._id, receiver_id: sarah._id, content: 'Yes, still available!', sent_at: hoursAgo(2.5) },
    { sender_id: sarah._id, receiver_id: alex._id, content: 'Can I see it tomorrow?', sent_at: hoursAgo(2) },
    { sender_id: alex._id, receiver_id: priya._id, content: 'Hey, interested in the headphones', sent_at: hoursAgo(48) },
    { sender_id: priya._id, receiver_id: alex._id, content: 'Sure, see you at 3pm!', sent_at: hoursAgo(47) },
  ]);

  console.log(`\nDone. Demo accounts (all share the password "${DEMO_PASSWORD}", sign in via the frontend's login form):`);
  demoUsers.forEach((u) => console.log(`  ${u.email}${u.role === 'admin' ? ' (admin)' : u.verified ? ' (verified student)' : ' (unverified student)'}`));

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
