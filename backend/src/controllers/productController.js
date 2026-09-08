import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const BDT_RATE = 120; // matches frontend's usdToBdt conversion; product.price is stored in USD

// GET /api/categories
export const getCategories = asyncHandler(async (req, res) => {
  res.json(await Category.find());
});

// GET /api/products?search=&category=&condition=&minPrice=&maxPrice=&location=&sort=&page=&limit=
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, condition, minPrice, maxPrice, location, sort, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (search) filter.$or = [{ title: new RegExp(escapeRegex(search), 'i') }, { description: new RegExp(escapeRegex(search), 'i') }];
  if (category) filter.category_id = category;
  if (condition) filter.condition = condition;
  if (location) filter.location = new RegExp(escapeRegex(location), 'i');
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice) / BDT_RATE;
    if (maxPrice) filter.price.$lte = Number(maxPrice) / BDT_RATE;
  }

  let sortSpec = { created_at: -1 };
  if (sort === 'price_asc' || sort === 'price_low') sortSpec = { price: 1 };
  else if (sort === 'price_desc' || sort === 'price_high') sortSpec = { price: -1 };

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;

  const [products, total, categories] = await Promise.all([
    Product.find(filter).sort(sortSpec).skip((pageNum - 1) * limitNum).limit(limitNum),
    Product.countDocuments(filter),
    Category.find(),
  ]);

  res.json({
    products,
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    categories,
  });
});

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// POST /api/products  (auth required)
export const createProduct = asyncHandler(async (req, res) => {
  const { title, price, condition, description, location, category_id, image } = req.body;
  if (!title || price === undefined || !condition) {
    return res.status(400).json({ message: 'title, price and condition are required' });
  }

  const product = await Product.create({
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
  });
  res.status(201).json(product);
});

// PUT /api/products/:id  (auth + must be the owner)
export const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller_id.toString() !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only edit your own listings' });
  }

  const { title, price, condition, description, location, category_id, image } = req.body;
  if (title !== undefined) product.title = title;
  if (price !== undefined) product.price = Number(price);
  if (condition !== undefined) product.condition = condition;
  if (description !== undefined) product.description = description;
  if (location !== undefined) product.location = location;
  if (category_id !== undefined) product.category_id = category_id;
  if (image !== undefined) product.image = image;
  await product.save();
  res.json(product);
});

// DELETE /api/products/:id  (auth + must be the owner)
export const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' });
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.seller_id.toString() !== req.user.user_id) {
    return res.status(403).json({ message: 'You can only delete your own listings' });
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted' });
});

// POST /api/products/:id/wishlist  (auth)
export const addToWishlist = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  if (!mongoose.isValidObjectId(productId) || !(await Product.exists({ _id: productId }))) {
    return res.status(404).json({ message: 'Product not found' });
  }
  await User.findByIdAndUpdate(req.user.user_id, { $addToSet: { wishlist: productId } });
  res.json({ message: 'Added to wishlist' });
});

// DELETE /api/products/:id/wishlist  (auth)
export const removeFromWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.user_id, { $pull: { wishlist: req.params.id } });
  res.json({ message: 'Removed from wishlist' });
});

// GET /api/wishlist  (auth) - full product objects, not just ids
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.user_id);
  res.json(await Product.find({ _id: { $in: user.wishlist } }));
});

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
