const express = require('express');
const { Order, OrderItem, Cart, CartItem, Product, User } = require('../models/index');
const { authenticateToken } = require('../middleware/auth');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Place order
router.post('/place', authenticateToken, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const user = await User.findByPk(req.user.id);

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalPrice: cart.totalPrice,
      paymentMethod: paymentMethod || 'stripe',
      paymentStatus: 'pending',
      orderStatus: 'placed',
      shippingFullName: user.fullName,
      shippingStreet: shippingAddress?.street || user.street,
      shippingCity: shippingAddress?.city || user.city,
      shippingState: shippingAddress?.state || user.state,
      shippingPincode: shippingAddress?.pincode || user.pincode,
      shippingCountry: shippingAddress?.country || user.country,
      shippingPhone: user.phone,
    });

    // Create order items
    const orderItems = cart.items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      image: item.product.images ? JSON.parse(item.product.images)[0] : '',
    }));

    await OrderItem.bulkCreate(orderItems);

    // Clear cart
    await CartItem.destroy({ where: { cartId: cart.id } });
    await cart.update({ totalPrice: 0 });

    // Send order confirmation email
    try {
      await sendEmail(
        user.email,
        'Order Confirmation',
        `<h1>Order Placed Successfully!</h1>
        <p>Order ID: ${order.id}</p>
        <p>Total: ₹${order.totalPrice}</p>
        <p>Thank you for shopping with NOVAMART!</p>`
      );
    } catch (emailError) {
      console.warn('Failed to send order email:', emailError.message);
    }

    const newOrder = await Order.findByPk(order.id, {
      include: {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// Get all orders of user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user owns this order
    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Cancel order
router.put('/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findByPk(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (order.orderStatus !== 'placed') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    await order.update({
      orderStatus: 'cancelled',
      cancellationReason: reason || 'User cancelled',
      cancelledAt: new Date(),
    });

    const updatedOrder = await Order.findByPk(order.id, {
      include: {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;
