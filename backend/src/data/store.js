// ---------------------------------------------------------------------------
// In-memory "database". No MongoDB/Postgres here on purpose - everything
// lives in plain JS objects/arrays that reset when the server restarts.
// This lets you see exactly how a backend manages data (create/read/update/
// delete, relations, filtering) without also having to stand up a real
// database. Swapping this file for real DB queries later is the natural
// next step once this part makes sense.
// ---------------------------------------------------------------------------
import bcrypt from 'bcryptjs';
import { seedCounter } from '../utils/ids.js';

const now = new Date();
const hoursFromNow = (h) => new Date(now.getTime() + h * 3600000).toISOString();
const hoursAgo = (h) => new Date(now.getTime() - h * 3600000).toISOString();

// Every seed user shares this password so you can log straight in and see
// the app working end to end. bcrypt.hashSync is fine here (startup only,
// not on the request path).
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

export const db = {
  users: [
    { user_id: 'user_001', name: 'Alex Student', email: 'alex@university.edu', password: DEMO_PASSWORD_HASH, studentId: 'STU-2024-042', verified: true, role: 'student', avatar: null, phone: '+1-555-0100', bio: 'CS junior. Love hiking and photography.', rating_avg: 4.8, created_at: '2024-01-15T10:00:00Z', ride_count: 12 },
    { user_id: 'user_002', name: 'Sarah Chen', email: 'sarah@university.edu', password: DEMO_PASSWORD_HASH, studentId: 'STU-2024-015', verified: true, role: 'student', avatar: null, phone: '+1-555-0102', bio: 'Business major, love reading and coffee.', rating_avg: 4.5, created_at: '2024-02-01T10:00:00Z', ride_count: 8 },
    { user_id: 'user_003', name: 'Rafiq Hasan', email: 'rafiq@university.edu', password: DEMO_PASSWORD_HASH, studentId: 'STU-2024-023', verified: false, role: 'student', avatar: null, phone: '+1-555-0103', bio: 'Engineering student. Part-time photographer.', rating_avg: 4.2, created_at: '2024-03-10T10:00:00Z', ride_count: 5 },
    { user_id: 'user_004', name: 'Priya Sharma', email: 'priya@university.edu', password: DEMO_PASSWORD_HASH, studentId: 'STU-2024-008', verified: true, role: 'student', avatar: null, phone: '+1-555-0104', bio: 'Art major. Love painting and music.', rating_avg: 4.9, created_at: '2024-01-20T10:00:00Z', ride_count: 15 },
    { user_id: 'user_005', name: 'Emily Watson', email: 'emily@university.edu', password: DEMO_PASSWORD_HASH, studentId: 'STU-2024-031', verified: true, role: 'student', avatar: null, phone: '+1-555-0105', bio: 'Literature major. Book club organizer.', rating_avg: 4.0, created_at: '2024-04-05T10:00:00Z', ride_count: 3 },
    { user_id: 'user_admin', name: 'Campus Admin', email: 'admin@university.edu', password: DEMO_PASSWORD_HASH, studentId: 'STAFF-0001', verified: true, role: 'admin', avatar: null, phone: '+1-555-0000', bio: 'Marketplace administrator.', rating_avg: 5.0, created_at: '2024-01-01T10:00:00Z', ride_count: 0 },
  ],

  categories: [
    { category_id: 'cat_1', name: 'Electronics' },
    { category_id: 'cat_2', name: 'Books' },
    { category_id: 'cat_3', name: 'Furniture' },
    { category_id: 'cat_4', name: 'Clothing' },
    { category_id: 'cat_5', name: 'Sports & Outdoors' },
    { category_id: 'cat_6', name: 'Other' },
  ],

  products: [
    { product_id: 'prod_1', title: 'MacBook Air M1 (2020)', price: 720, condition: 'Like New', seller_id: 'user_001', seller_name: 'Alex Student', seller_rating: 4.8, seller_verified: true, description: 'Used for one semester. Mint condition, original box included.', location: 'NSU Campus', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod1/600/400', created_at: hoursAgo(2) },
    { product_id: 'prod_2', title: 'Calculus Textbook — Stewart 8th Ed.', price: 25, condition: 'Good', seller_id: 'user_002', seller_name: 'Sarah Chen', seller_rating: 4.5, seller_verified: true, description: 'Some highlights, overall good condition.', location: 'Dhanmondi', category_id: 'cat_2', image: 'https://picsum.photos/seed/prod2/600/400', created_at: hoursAgo(5) },
    { product_id: 'prod_3', title: 'IKEA Study Desk', price: 65, condition: 'Good', seller_id: 'user_003', seller_name: 'Rafiq Hasan', seller_rating: 4.2, seller_verified: false, description: 'Adjustable height, sturdy build.', location: 'Bashundhara', category_id: 'cat_3', image: 'https://picsum.photos/seed/prod3/600/400', created_at: hoursAgo(24) },
    { product_id: 'prod_4', title: 'Sony WH-1000XM4 Headphones', price: 190, condition: 'Like New', seller_id: 'user_004', seller_name: 'Priya Sharma', seller_rating: 4.9, seller_verified: true, description: 'Used twice. Amazing noise cancellation.', location: 'Gulshan', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod4/600/400', created_at: hoursAgo(72) },
    { product_id: 'prod_5', title: 'Yoga Mat Premium 6mm', price: 35, condition: 'Good', seller_id: 'user_001', seller_name: 'Alex Student', seller_rating: 4.8, seller_verified: true, description: 'Non-slip, used for 3 months.', location: 'Dhanmondi', category_id: 'cat_5', image: 'https://picsum.photos/seed/prod5/600/400', created_at: hoursAgo(48) },
    { product_id: 'prod_6', title: 'Principles of Microeconomics', price: 30, condition: 'Fair', seller_id: 'user_005', seller_name: 'Emily Watson', seller_rating: 4.0, seller_verified: true, description: 'Worn cover, all pages intact.', location: 'Mohammadpur', category_id: 'cat_2', image: 'https://picsum.photos/seed/prod6/600/400', created_at: hoursAgo(96) },
    { product_id: 'prod_7', title: 'Graphic T-Shirt Bundle (5 pcs)', price: 60, condition: 'Good', seller_id: 'user_003', seller_name: 'Rafiq Hasan', seller_rating: 4.2, seller_verified: false, description: 'Size M, premium cotton.', location: 'Uttara', category_id: 'cat_4', image: 'https://picsum.photos/seed/prod7/600/400', created_at: hoursAgo(36) },
    { product_id: 'prod_8', title: 'iPad Air + Pencil 2nd Gen', price: 550, condition: 'Like New', seller_id: 'user_002', seller_name: 'Sarah Chen', seller_rating: 4.5, seller_verified: true, description: 'M1 chip, great for note-taking.', location: 'Gulshan', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod8/600/400', created_at: hoursAgo(12) },
    { product_id: 'prod_9', title: 'Ergonomic Office Chair', price: 120, condition: 'Good', seller_id: 'user_005', seller_name: 'Emily Watson', seller_rating: 4.0, seller_verified: true, description: 'Adjustable lumbar support.', location: 'Mohammadpur', category_id: 'cat_3', image: 'https://picsum.photos/seed/prod9/600/400', created_at: hoursAgo(60) },
    { product_id: 'prod_10', title: 'North Face Winter Jacket', price: 150, condition: 'New', seller_id: 'user_004', seller_name: 'Priya Sharma', seller_rating: 4.9, seller_verified: true, description: 'Never worn, wrong size (L, need M).', location: 'Banani', category_id: 'cat_4', image: 'https://picsum.photos/seed/prod10/600/400', created_at: hoursAgo(8) },
    { product_id: 'prod_11', title: 'Arduino Starter Kit', price: 65, condition: 'Good', seller_id: 'user_001', seller_name: 'Alex Student', seller_rating: 4.8, seller_verified: true, description: 'Complete with sensors and guide.', location: 'Dhanmondi', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod11/600/400', created_at: hoursAgo(16) },
    { product_id: 'prod_12', title: 'Spalding Basketball', price: 40, condition: 'Fair', seller_id: 'user_002', seller_name: 'Sarah Chen', seller_rating: 4.5, seller_verified: true, description: 'Indoor/outdoor, some wear.', location: 'Gulshan', category_id: 'cat_5', image: 'https://picsum.photos/seed/prod12/600/400', created_at: hoursAgo(84) },
  ],

  rides: [
    { ride_id: 'ride_1', driver_id: 'user_001', driver_name: 'Alex Student', driver_rating: 4.8, origin: 'Dhanmondi 27', destination: 'NSU Campus', date_time: hoursFromNow(4), seats_total: 4, seats_available: 3, fare_per_seat: 3, vehicle_details: 'Toyota Axio, Blue', status: 'active', notes: '' },
    { ride_id: 'ride_2', driver_id: 'user_002', driver_name: 'Sarah Chen', driver_rating: 4.5, origin: 'Gulshan 1', destination: 'NSU Campus', date_time: hoursFromNow(6), seats_total: 3, seats_available: 2, fare_per_seat: 4, vehicle_details: 'Honda Civic, White', status: 'active', notes: '' },
    { ride_id: 'ride_3', driver_id: 'user_003', driver_name: 'Rafiq Hasan', driver_rating: 4.2, origin: 'Uttara Sector 10', destination: 'NSU Campus', date_time: hoursFromNow(28), seats_total: 4, seats_available: 4, fare_per_seat: 5, vehicle_details: 'Toyota Corolla, Silver', status: 'active', notes: '' },
    { ride_id: 'ride_4', driver_id: 'user_004', driver_name: 'Priya Sharma', driver_rating: 4.9, origin: 'Banani 11', destination: 'NSU Campus', date_time: hoursFromNow(5), seats_total: 3, seats_available: 1, fare_per_seat: 2, vehicle_details: 'Suzuki Swift, Red', status: 'active', notes: '' },
    { ride_id: 'ride_5', driver_id: 'user_005', driver_name: 'Emily Watson', driver_rating: 4.0, origin: 'Mohammadpur', destination: 'Gulshan 2', date_time: hoursFromNow(26), seats_total: 4, seats_available: 4, fare_per_seat: 4, vehicle_details: 'Nissan Sunny, Gray', status: 'active', notes: '' },
    { ride_id: 'ride_6', driver_id: 'user_001', driver_name: 'Alex Student', driver_rating: 4.8, origin: 'NSU Campus', destination: 'Dhanmondi 27', date_time: hoursFromNow(8), seats_total: 4, seats_available: 2, fare_per_seat: 3, vehicle_details: 'Toyota Axio, Blue', status: 'active', notes: '' },
    { ride_id: 'ride_7', driver_id: 'user_002', driver_name: 'Sarah Chen', driver_rating: 4.5, origin: 'NSU Campus', destination: 'Gulshan 1', date_time: hoursFromNow(10), seats_total: 3, seats_available: 0, fare_per_seat: 4, vehicle_details: 'Honda Civic, White', status: 'completed', notes: '' },
  ],

  // conversations[user_id] = Set-like array of the other user_ids they've talked to.
  // messages is a flat list; getConversations/getMessages derive views from it.
  messages: [
    { message_id: 'msg_1', sender_id: 'user_002', receiver_id: 'user_001', content: 'Hi! Is the iPad still available?', sent_at: hoursAgo(3) },
    { message_id: 'msg_2', sender_id: 'user_001', receiver_id: 'user_002', content: 'Yes, still available!', sent_at: hoursAgo(2.5) },
    { message_id: 'msg_3', sender_id: 'user_002', receiver_id: 'user_001', content: 'Can I see it tomorrow?', sent_at: hoursAgo(2) },
    { message_id: 'msg_4', sender_id: 'user_001', receiver_id: 'user_004', content: 'Hey, interested in the headphones', sent_at: hoursAgo(48) },
    { message_id: 'msg_5', sender_id: 'user_004', receiver_id: 'user_001', content: 'Sure, see you at 3pm!', sent_at: hoursAgo(47) },
  ],

  // wishlists[user_id] = [product_id, ...]
  wishlists: {
    user_001: ['prod_4', 'prod_8'],
  },

  // payments[user_id] = [payment, ...]
  payments: {},
};

// Keep the id generator from ever reusing a seeded id.
seedCounter('prod_', 12);
seedCounter('ride_', 7);
seedCounter('msg_', 5);
seedCounter('user_', 5);
seedCounter('pay_', 0);

export function findUserById(userId) {
  return db.users.find((u) => u.user_id === userId);
}

export function findUserByEmail(email) {
  return db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

// Never send the password hash to the client.
export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}
