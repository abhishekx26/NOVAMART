const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    users,
  });
});

// Get user by ID (admin only)
router.get('/users/:userId', authenticateToken, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.userId)
    .select('-password')
    .populate('orders');

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Get all orders (admin only)
router.get('/orders', authenticateToken, isAdmin, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();
  const orders = await Order.find()
    .populate('userId', 'fullName email phone')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    total,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    orders,
  });
});

// Update order status (admin only)
router.put('/orders/:orderId', authenticateToken, isAdmin, async (req, res) => {
  const { orderStatus } = req.body;

  const validStatuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { orderStatus },
    { new: true }
  );

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({
    message: 'Order status updated',
    order,
  });
});

// Get analytics (admin only)
router.get('/analytics/summary', authenticateToken, isAdmin, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments({ isActive: true });

  const orders = await Order.find({ paymentStatus: 'completed' });
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  res.json({
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue,
  });
});

// Get top products by sales (admin only)
router.get('/analytics/top-products', authenticateToken, isAdmin, async (req, res) => {
  const orders = await Order.find({ paymentStatus: 'completed' }).populate(
    'items.productId'
  );

  const productSales = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const productId = item.productId._id.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          product: item.productId,
          totalSold: 0,
          totalRevenue: 0,
        };
      }
      productSales[productId].totalSold += item.quantity;
      productSales[productId].totalRevenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 10);

  res.json(topProducts);
});

module.exports = router;
