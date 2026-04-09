const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  const { category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

  let filter = { isActive: true };

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const skip = (page - 1) * limit;
  let sortObj = {};

  if (sort === 'price_asc') sortObj.price = 1;
  else if (sort === 'price_desc') sortObj.price = -1;
  else if (sort === 'newest') sortObj.createdAt = -1;
  else sortObj.rating = -1; // Default: by rating

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const total = await Product.countDocuments({
    category: category.toLowerCase(),
    isActive: true,
  });
  const products = await Product.find({
    category: category.toLowerCase(),
    isActive: true,
  })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// Search products
router.get('/search/:query', async (req, res) => {
  const { query } = req.params;
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const total = await Product.countDocuments({
    $text: { $search: query },
    isActive: true,
  });
  const products = await Product.find({
    $text: { $search: query },
    isActive: true,
  })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// Get single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Add product (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const {
    id,
    title,
    brand,
    price,
    mrp,
    discount,
    rating,
    ratingCount,
    category,
    images,
    colors,
    description,
  } = req.body;

  const product = new Product({
    id,
    title,
    brand,
    price,
    mrp,
    discount,
    rating,
    ratingCount,
    category,
    images,
    colors,
    description,
  });

  await product.save();

  res.status(201).json({
    message: 'Product created successfully',
    product,
  });
});

// Update product (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({
    message: 'Product updated successfully',
    product,
  });
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;
