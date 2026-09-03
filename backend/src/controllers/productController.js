import { db } from '../data/store.js';
import { generateId } from '../utils/ids.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const BDT_RATE = 120; // matches frontend's usdToBdt conversion; product.price is stored in USD

// GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  res.json(db.categories);
});

// GET /api/products?search=&category=&condition=&minPrice=&maxPrice=&location=&sort=&page=&limit=
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, condition, minPrice, maxPrice, location, sort, page = 1, limit = 20 } = req.query;

  let products = [...db.products];

  if (search) {
    const s = String(search).toLowerCase();
    products = products.filter(
      (p) => p.title.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s)
    );
  }
  if (category) products = products.filter((p) => p.category_id === category);
  if (condition) products = products.filter((p) => p.condition === condition);
  if (minPrice) products = products.filter((p) => Math.round(p.price * BDT_RATE) >= Number(minPrice));
  if (maxPrice) products = products.filter((p) => Math.round(p.price * BDT_RATE) <= Number(maxPrice));
  if (location) products = products.filter((p) => (p.location || '').toLowerCase().includes(String(location).toLowerCase()));

  if (sort === 'price_asc' || sort === 'price_low') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc' || sort === 'price_high') products.sort((a, b) => b.price - a.price);
  else products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const total = products.length;
  const pages = Math.ceil(total / limitNum);
  const paginated = products.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  res.json({
    products: paginated,
    pagination: { page: pageNum, limit: limitNum, total, pages },
    categories: db.categories,
  });
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = db.products.find((p) => p.product_id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products  (auth required)
export const createProduct = asyncHandler(async (req, res) => {
  const { title, price, condition, description, location, category_id, image } = req.body;
  if (!title || price === undefined || !condition) {
    return res.status(400).json({ message: 'title, price and condition are required' });
  }

  const product = {
    product_id: generateId('prod_'),
    title,
    price: Number(price),
    condition,
    description: description || '',
    location: location || '',
    category_id: category_id || null,
    image: image || null,
    seller_id: req.user.user_id,
    seller_name: req.user.name,
    seller_rating: req.user.rating_avg || 0,
    seller_verified: req.user.verified || false,
    created_at: new Date().toISOString(),
  };
  db.products.unshift(product);
  res.status(201).json(product);
});

// PUT /api/products/:id  (auth + must be the owner)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = db.products.find((p) => p.product_id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller_id !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only edit your own listings' });
  }

  Object.assign(product, req.body, { price: req.body.price !== undefined ? Number(req.body.price) : product.price });
  res.json(product);
});

// DELETE /api/products/:id  (auth + must be the owner)
export const deleteProduct = asyncHandler(async (req, res) => {
  const idx = db.products.findIndex((p) => p.product_id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  if (db.products[idx].seller_id !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only delete your own listings' });
  }
  db.products.splice(idx, 1);
  res.json({ message: 'Product deleted' });
});

// POST /api/products/:id/wishlist  (auth)
export const addToWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  if (!db.products.find((p) => p.product_id === productId)) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const list = db.wishlists[req.user.user_id] || (db.wishlists[req.user.user_id] = []);
  if (!list.includes(productId)) list.push(productId);
  res.json({ message: 'Added to wishlist' });
});

// DELETE /api/products/:id/wishlist  (auth)
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const list = db.wishlists[req.user.user_id] || [];
  db.wishlists[req.user.user_id] = list.filter((id) => id !== productId);
  res.json({ message: 'Removed from wishlist' });
});

// GET /api/wishlist  (auth) - full product objects, not just ids
export const getWishlist = asyncHandler(async (req, res) => {
  const ids = db.wishlists[req.user.user_id] || [];
  res.json(db.products.filter((p) => ids.includes(p.product_id)));
});
