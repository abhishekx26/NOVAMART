const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id }).populate(
    'items.productId'
  );

  if (!cart) {
    cart = new Cart({
      userId: req.user.id,
      items: [],
      totalPrice: 0,
    });
    await cart.save();
  }

  res.json(cart);
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ error: 'Product ID and quantity are required' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  let cart = await Cart.findOne({ userId: req.user.id });

  if (!cart) {
    cart = new Cart({
      userId: req.user.id,
      items: [],
      totalPrice: 0,
    });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity,
      size,
      color,
    });
  }

  // Calculate total price
  cart.totalPrice = 0;
  for (let item of cart.items) {
    const prod = await Product.findById(item.productId);
    cart.totalPrice += prod.price * item.quantity;
  }

  await cart.save();
  await cart.populate('items.productId');

  res.status(201).json({
    message: 'Item added to cart',
    cart,
  });
});

// Update cart item quantity
router.put('/:itemId', authenticateToken, async (req, res) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const item = cart.items.find((i) => i._id.toString() === req.params.itemId);
  if (!item) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (i) => i._id.toString() !== req.params.itemId
    );
  } else {
    item.quantity = quantity;
  }

  // Recalculate total
  cart.totalPrice = 0;
  for (let cartItem of cart.items) {
    const product = await Product.findById(cartItem.productId);
    cart.totalPrice += product.price * cartItem.quantity;
  }

  await cart.save();
  await cart.populate('items.productId');

  res.json({
    message: 'Cart updated',
    cart,
  });
});

// Remove item from cart
router.delete('/:itemId', authenticateToken, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  cart.items = cart.items.filter(
    (i) => i._id.toString() !== req.params.itemId
  );

  // Recalculate total
  cart.totalPrice = 0;
  for (let item of cart.items) {
    const product = await Product.findById(item.productId);
    cart.totalPrice += product.price * item.quantity;
  }

  await cart.save();
  await cart.populate('items.productId');

  res.json({
    message: 'Item removed from cart',
    cart,
  });
});

// Clear entire cart
router.delete('/', authenticateToken, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id });
  if (!cart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.json({
    message: 'Cart cleared',
    cart,
  });
});

module.exports = router;
