const STORAGE_PREFIX = 'campusride_';
const getEnv = (key, fallback) => {
  try {
    const val = import.meta.env?.[key];
    return val !== undefined && val !== '' ? val : fallback;
  } catch {
    return fallback;
  }
};
export const API_URL = getEnv('VITE_API_URL', 'http://localhost:5000/api');
const previewRaw = getEnv('VITE_PREVIEW_MODE', null);
export const IS_PREVIEW = previewRaw !== null ? String(previewRaw) === 'true' : true;

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function saveJSON(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) { console.error('saveJSON failed', e); }
}

export function saveToken(token) {
  try {
    localStorage.setItem(STORAGE_PREFIX + 'token', token);
  } catch (e) { console.error('saveToken failed', e); }
}

export function getToken() {
  try {
    return localStorage.getItem(STORAGE_PREFIX + 'token');
  } catch { return null; }
}

const now = new Date();
const t = (h) => new Date(now.getTime() + h * 3600000);
const p = (h) => new Date(now.getTime() - h * 3600000);

export const seedCurrentUser = {
  user_id: 'user_001',
  name: 'Alex Student',
  email: 'alex@university.edu',
  studentId: 'STU-2024-042',
  verified: true,
  role: 'student',
  avatar: null,
  phone: '+1-555-0100',
  bio: 'CS junior. Love hiking and photography.',
  rating_avg: 4.8,
  created_at: '2024-01-15T10:00:00Z',
  ride_count: 12,
};

export const seedUsers = {
  user_002: { user_id: 'user_002', name: 'Sarah Chen', email: 'sarah@university.edu', studentId: 'STU-2024-015', verified: true, role: 'student', avatar: null, phone: '+1-555-0102', bio: 'Business major, love reading and coffee.', rating_avg: 4.5, created_at: '2024-02-01T10:00:00Z', ride_count: 8 },
  user_003: { user_id: 'user_003', name: 'Rafiq Hasan', email: 'rafiq@university.edu', studentId: 'STU-2024-023', verified: false, role: 'student', avatar: null, phone: '+1-555-0103', bio: 'Engineering student. Part-time photographer.', rating_avg: 4.2, created_at: '2024-03-10T10:00:00Z', ride_count: 5 },
  user_004: { user_id: 'user_004', name: 'Priya Sharma', email: 'priya@university.edu', studentId: 'STU-2024-008', verified: true, role: 'student', avatar: null, phone: '+1-555-0104', bio: 'Art major. Love painting and music.', rating_avg: 4.9, created_at: '2024-01-20T10:00:00Z', ride_count: 15 },
  user_005: { user_id: 'user_005', name: 'Emily Watson', email: 'emily@university.edu', studentId: 'STU-2024-031', verified: true, role: 'student', avatar: null, phone: '+1-555-0105', bio: 'Literature major. Book club organizer.', rating_avg: 4.0, created_at: '2024-04-05T10:00:00Z', ride_count: 3 },
};

export const seedCategories = [
  { category_id: 'cat_1', name: 'Electronics' },
  { category_id: 'cat_2', name: 'Books' },
  { category_id: 'cat_3', name: 'Furniture' },
  { category_id: 'cat_4', name: 'Clothing' },
  { category_id: 'cat_5', name: 'Sports & Outdoors' },
  { category_id: 'cat_6', name: 'Other' },
];

export const seedProducts = [
  { product_id: 'prod_1', title: 'MacBook Air M1 (2020)', price: 720, condition: 'Like New', seller_id: 'user_001', seller_name: 'Alex Student', seller_rating: 4.8, seller_verified: true, description: 'Used for one semester. Mint condition, original box included.', location: 'NSU Campus', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod1/600/400', created_at: p(2).toISOString() },
  { product_id: 'prod_2', title: 'Calculus Textbook — Stewart 8th Ed.', price: 25, condition: 'Good', seller_id: 'user_002', seller_name: 'Sarah Chen', seller_rating: 4.5, seller_verified: true, description: 'Some highlights, overall good condition.', location: 'Dhanmondi', category_id: 'cat_2', image: 'https://picsum.photos/seed/prod2/600/400', created_at: p(5).toISOString() },
  { product_id: 'prod_3', title: 'IKEA Study Desk', price: 65, condition: 'Good', seller_id: 'user_003', seller_name: 'Rafiq Hasan', seller_rating: 4.2, seller_verified: false, description: 'Adjustable height, sturdy build.', location: 'Bashundhara', category_id: 'cat_3', image: 'https://picsum.photos/seed/prod3/600/400', created_at: p(24).toISOString() },
  { product_id: 'prod_4', title: 'Sony WH-1000XM4 Headphones', price: 190, condition: 'Like New', seller_id: 'user_004', seller_name: 'Priya Sharma', seller_rating: 4.9, seller_verified: true, description: 'Used twice. Amazing noise cancellation.', location: 'Gulshan', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod4/600/400', created_at: p(72).toISOString() },
  { product_id: 'prod_5', title: 'Yoga Mat Premium 6mm', price: 35, condition: 'Good', seller_id: 'user_001', seller_name: 'Alex Student', seller_rating: 4.8, seller_verified: true, description: 'Non-slip, used for 3 months.', location: 'Dhanmondi', category_id: 'cat_5', image: 'https://picsum.photos/seed/prod5/600/400', created_at: p(48).toISOString() },
  { product_id: 'prod_6', title: 'Principles of Microeconomics', price: 30, condition: 'Fair', seller_id: 'user_005', seller_name: 'Emily Watson', seller_rating: 4.0, seller_verified: true, description: 'Worn cover, all pages intact.', location: 'Mohammadpur', category_id: 'cat_2', image: 'https://picsum.photos/seed/prod6/600/400', created_at: p(96).toISOString() },
  { product_id: 'prod_7', title: 'Graphic T-Shirt Bundle (5 pcs)', price: 60, condition: 'Good', seller_id: 'user_003', seller_name: 'Rafiq Hasan', seller_rating: 4.2, seller_verified: false, description: 'Size M, premium cotton.', location: 'Uttara', category_id: 'cat_4', image: 'https://picsum.photos/seed/prod7/600/400', created_at: p(36).toISOString() },
  { product_id: 'prod_8', title: 'iPad Air + Pencil 2nd Gen', price: 550, condition: 'Like New', seller_id: 'user_002', seller_name: 'Sarah Chen', seller_rating: 4.5, seller_verified: true, description: 'M1 chip, great for note-taking.', location: 'Gulshan', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod8/600/400', created_at: p(12).toISOString() },
  { product_id: 'prod_9', title: 'Ergonomic Office Chair', price: 120, condition: 'Good', seller_id: 'user_005', seller_name: 'Emily Watson', seller_rating: 4.0, seller_verified: true, description: 'Adjustable lumbar support.', location: 'Mohammadpur', category_id: 'cat_3', image: 'https://picsum.photos/seed/prod9/600/400', created_at: p(60).toISOString() },
  { product_id: 'prod_10', title: 'North Face Winter Jacket', price: 150, condition: 'New', seller_id: 'user_004', seller_name: 'Priya Sharma', seller_rating: 4.9, seller_verified: true, description: 'Never worn, wrong size (L, need M).', location: 'Banani', category_id: 'cat_4', image: 'https://picsum.photos/seed/prod10/600/400', created_at: p(8).toISOString() },
  { product_id: 'prod_11', title: 'Arduino Starter Kit', price: 65, condition: 'Good', seller_id: 'user_001', seller_name: 'Alex Student', seller_rating: 4.8, seller_verified: true, description: 'Complete with sensors and guide.', location: 'Dhanmondi', category_id: 'cat_1', image: 'https://picsum.photos/seed/prod11/600/400', created_at: p(16).toISOString() },
  { product_id: 'prod_12', title: 'Spalding Basketball', price: 40, condition: 'Fair', seller_id: 'user_002', seller_name: 'Sarah Chen', seller_rating: 4.5, seller_verified: true, description: 'Indoor/outdoor, some wear.', location: 'Gulshan', category_id: 'cat_5', image: 'https://picsum.photos/seed/prod12/600/400', created_at: p(84).toISOString() },
];

export const seedRides = [
  { ride_id: 'ride_1', driver_id: 'user_001', driver_name: 'Alex Student', driver_rating: 4.8, origin: 'Dhanmondi 27', destination: 'NSU Campus', date_time: t(4).toISOString(), seats_total: 4, seats_available: 3, fare_per_seat: 3, vehicle_details: 'Toyota Axio, Blue', status: 'active', notes: '' },
  { ride_id: 'ride_2', driver_id: 'user_002', driver_name: 'Sarah Chen', driver_rating: 4.5, origin: 'Gulshan 1', destination: 'NSU Campus', date_time: t(6).toISOString(), seats_total: 3, seats_available: 2, fare_per_seat: 4, vehicle_details: 'Honda Civic, White', status: 'active', notes: '' },
  { ride_id: 'ride_3', driver_id: 'user_003', driver_name: 'Rafiq Hasan', driver_rating: 4.2, origin: 'Uttara Sector 10', destination: 'NSU Campus', date_time: t(28).toISOString(), seats_total: 4, seats_available: 4, fare_per_seat: 5, vehicle_details: 'Toyota Corolla, Silver', status: 'active', notes: '' },
  { ride_id: 'ride_4', driver_id: 'user_004', driver_name: 'Priya Sharma', driver_rating: 4.9, origin: 'Banani 11', destination: 'NSU Campus', date_time: t(5).toISOString(), seats_total: 3, seats_available: 1, fare_per_seat: 2, vehicle_details: 'Suzuki Swift, Red', status: 'active', notes: '' },
  { ride_id: 'ride_5', driver_id: 'user_005', driver_name: 'Emily Watson', driver_rating: 4.0, origin: 'Mohammadpur', destination: 'Gulshan 2', date_time: t(26).toISOString(), seats_total: 4, seats_available: 4, fare_per_seat: 4, vehicle_details: 'Nissan Sunny, Gray', status: 'active', notes: '' },
  { ride_id: 'ride_6', driver_id: 'user_001', driver_name: 'Alex Student', driver_rating: 4.8, origin: 'NSU Campus', destination: 'Dhanmondi 27', date_time: t(8).toISOString(), seats_total: 4, seats_available: 2, fare_per_seat: 3, vehicle_details: 'Toyota Axio, Blue', status: 'active', notes: '' },
  { ride_id: 'ride_7', driver_id: 'user_002', driver_name: 'Sarah Chen', driver_rating: 4.5, origin: 'NSU Campus', destination: 'Gulshan 1', date_time: t(10).toISOString(), seats_total: 3, seats_available: 0, fare_per_seat: 4, vehicle_details: 'Honda Civic, White', status: 'completed', notes: '' },
];

export const seedConversations = [
  { user_id: 'user_002', name: 'Sarah Chen', profile_pic: null, last_message: 'Is the iPad still available?' },
  { user_id: 'user_004', name: 'Priya Sharma', profile_pic: null, last_message: 'Sure, see you at 3pm!' },
];

export const seedMessages = {
  user_002: [
    { message_id: 'msg_1', sender_id: 'user_002', content: 'Hi! Is the iPad still available?', sent_at: p(3).toISOString() },
    { message_id: 'msg_2', sender_id: 'user_001', content: 'Yes, still available!', sent_at: p(2.5).toISOString() },
    { message_id: 'msg_3', sender_id: 'user_002', content: 'Can I see it tomorrow?', sent_at: p(2).toISOString() },
  ],
  user_004: [
    { message_id: 'msg_4', sender_id: 'user_001', content: 'Hey, interested in the headphones', sent_at: p(48).toISOString() },
    { message_id: 'msg_5', sender_id: 'user_004', content: 'Sure, see you at 3pm!', sent_at: p(47).toISOString() },
  ],
};

export const seedWishlist = ['prod_4', 'prod_8'];

export const landingFeatured = [
  { product_id: 'fp1', title: 'MacBook Air M1 (2020)', price: 720, condition: 'Like New', image: 'https://picsum.photos/seed/landing1/600/400', location: 'NSU Campus', created_at: p(2).toISOString(), seller_name: 'Aiman Rahman', seller_id: 'user_f1', seller_rating: 4.9 },
  { product_id: 'fp2', title: 'Calculus Textbook — Stewart 8th Ed.', price: 25, condition: 'Good', image: 'https://picsum.photos/seed/landing2/600/400', location: 'Dhanmondi', created_at: p(5).toISOString(), seller_name: 'Sadia Islam', seller_id: 'user_f2', seller_rating: 4.7 },
  { product_id: 'fp3', title: 'IKEA Study Desk', price: 65, condition: 'Good', image: 'https://picsum.photos/seed/landing3/600/400', location: 'Bashundhara', created_at: p(24).toISOString(), seller_name: 'Rifat Hasan', seller_id: 'user_f3', seller_rating: 4.8 },
  { product_id: 'fp4', title: 'Sony WH-1000XM4 Headphones', price: 190, condition: 'Like New', image: 'https://picsum.photos/seed/landing4/600/400', location: 'Gulshan', created_at: p(72).toISOString(), seller_name: 'Nusrat Jahan', seller_id: 'user_f4', seller_rating: 5.0 },
];

export const landingTrendingItems = [
  { id: 't1', title: 'MacBook Air M1 (2020)', price: '$720', image: 'https://picsum.photos/seed/trend1/600/400', badge: 'Trending' },
  { id: 't2', title: 'Calculus Textbook — Stewart 8th Ed.', price: '$25', image: 'https://picsum.photos/seed/trend2/600/400', badge: 'Popular' },
];

export const landingTrendingRide = {
  id: 'tr1', origin: 'NSU Campus', destination: 'Dhanmondi 27', time: 'Today · 5:30 PM', seats: '2 seats', fare: '$3',
};

export const landingCampusRides = [
  { ride_id: 'fr1', driver_name: 'Rifat Hasan', driver_id: 'user_f3', driver_rating: 4.9, vehicle_details: 'Toyota Axio', fare_per_seat: 3, origin: 'NSU Campus', destination: 'Dhanmondi 27', date_time: t(4).toISOString(), seats_available: 2, seats_total: 3 },
  { ride_id: 'fr2', driver_name: 'Sadia Islam', driver_id: 'user_f2', driver_rating: 4.7, vehicle_details: 'Honda Civic', fare_per_seat: 2, origin: 'Bashundhara Gate', destination: 'NSU Campus', date_time: t(20).toISOString(), seats_available: 3, seats_total: 4 },
  { ride_id: 'fr3', driver_name: 'Aiman Rahman', driver_id: 'user_f1', driver_rating: 5.0, vehicle_details: 'Toyota Premio', fare_per_seat: 4, origin: 'NSU Campus', destination: 'Gulshan 2', date_time: t(6).toISOString(), seats_available: 1, seats_total: 3 },
];

export const landingTestimonials = [
  { name: 'Sadia Islam', dept: 'CSE, NSU', text: "I sold my old textbooks in a day and picked up a study desk for half price. Life saver during finals.", avatar: null },
  { name: 'Rifat Hasan', dept: 'BBA, NSU', text: "Offering rides on my daily commute pays for my fuel. Made friends across departments too.", avatar: null },
  { name: 'Nusrat Jahan', dept: 'EEE, NSU', text: "The verified badges make it feel safe. I never worry about who I'm meeting on campus.", avatar: null },
];

export function formatTimeAgo(dateString) {
  if (!dateString) return null;
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ALL_KEYS = ['currentUser', 'users', 'categories', 'products', 'rides', 'conversations', 'messages', 'wishlist', 'token', 'counter'];

function generateId(prefix) {
  const c = loadJSON('counter', { product: 13, ride: 8, message: 6 });
  let key, id;
  if (prefix === 'prod_') { c.product += 1; key = 'product'; }
  else if (prefix === 'ride_') { c.ride += 1; key = 'ride'; }
  else if (prefix === 'msg_') { c.message += 1; key = 'message'; }
  id = prefix + c[key];
  saveJSON('counter', c);
  return id;
}

export { generateId };

export function initData() {
  if (!localStorage.getItem(STORAGE_PREFIX + 'products')) {
    saveJSON('currentUser', seedCurrentUser);
    saveJSON('users', seedUsers);
    saveJSON('categories', seedCategories);
    saveJSON('products', seedProducts);
    saveJSON('rides', seedRides);
    saveJSON('conversations', seedConversations);
    saveJSON('messages', seedMessages);
    saveJSON('wishlist', seedWishlist);
    saveJSON('counter', { product: 12, ride: 7, message: 5 });
  }
}

export function resetAllData() {
  ALL_KEYS.forEach(k => localStorage.removeItem(STORAGE_PREFIX + k));
  initData();
}
