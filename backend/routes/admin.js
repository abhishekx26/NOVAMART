const express = require('express');
const { sequelize } = require('../config/db');
const { User, Order, OrderItem, Product } = require('../models/index');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      users: rows,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID (admin only)
router.get('/users/:userId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Order, as: 'orders' }],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get all orders (admin only)
router.get('/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Order.findAndCountAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone'],
      },
      offset,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      orders: rows,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin only)
router.put('/orders/:orderId', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.update({ orderStatus });

    const updatedOrder = await Order.findByPk(order.id, {
      include: {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    res.json({
      message: 'Order status updated',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Get analytics (admin only)
router.get('/analytics/summary', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const totalProducts = await Product.count({ where: { isActive: true } });

    const completedOrders = await Order.findAll({
      where: { paymentStatus: 'completed' },
    });

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + (order.totalPrice || 0),
      0
    );

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get top products by sales (admin only)
router.get('/analytics/top-products', authenticateToken, isAdmin, async (req, res) => {
  try {
    const completedOrders = await Order.findAll({
      where: { paymentStatus: 'completed' },
      include: {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    const productSales = {};

    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId;
        if (!productSales[productId]) {
          productSales[productId] = {
            product: item.product,
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
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

module.exports = router;
