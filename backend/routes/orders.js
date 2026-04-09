const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Place order
router.post('/place', authenticateToken, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    'items.productId'
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Prepare order items
  const items = cart.items.map((item) => ({
    productId: item.productId._id,
    title: item.productId.title,
    price: item.productId.price,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    image: item.productId.images[0] || '',
  }));

  const order = new Order({
    userId: req.user.id,
    items,
    shippingAddress: shippingAddress || (await User.findById(req.user.id)).address,
    totalPrice: cart.totalPrice,
    paymentMethod: paymentMethod || 'stripe',
    paymentStatus: 'pending',
    orderStatus: 'placed',
  });

  await order.save();

  // Add order to user's orders
  await User.findByIdAndUpdate(req.user.id, {
    $push: { orders: order._id },
  });

  // Clear cart
  await Cart.findByIdAndUpdate(cart._id, {
    items: [],
    totalPrice: 0,
  });

  // Send order confirmation email
  const user = await User.findById(req.user.id);
  try {
    await sendEmail(
      user.email,
      'Order Confirmation',
      `<h1>Order Placed Successfully!</h1>
      <p>Order ID: ${order._id}</p>
      <p>Total: ₹${order.totalPrice}</p>
      <p>Thank you for shopping with NOVAMART!</p>`
    );
  } catch (emailError) {
    console.warn('Failed to send order email:', emailError.message);
  }

  res.status(201).json({
    message: 'Order placed successfully',
    order,
  });
});

// Get all orders of user
router.get('/', authenticateToken, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate('items.productId')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// Get single order
router.get('/:orderId', authenticateToken, async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate(
    'items.productId'
  );

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Check if user owns this order
  if (order.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.json(order);
});

// Cancel order
router.put('/:orderId/cancel', authenticateToken, async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  if (order.orderStatus !== 'placed') {
    return res.status(400).json({ error: 'Order cannot be cancelled' });
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason || 'User cancelled';
  order.cancelledAt = new Date();
  await order.save();

  res.json({
    message: 'Order cancelled successfully',
    order,
  });
});

module.exports = router;
