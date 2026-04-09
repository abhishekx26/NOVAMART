const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId: orderId.toString(),
        userId: req.user.id.toString(),
      },
    });

    order.stripePaymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm', authenticateToken, async (req, res) => {
  const { orderId, paymentIntentId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      await order.save();

      res.json({
        message: 'Payment successful',
        order,
      });
    } else {
      res.status(400).json({
        error: 'Payment not completed',
        status: paymentIntent.status,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { orderId } = paymentIntent.metadata;

    const order = await Order.findById(orderId);
    if (order && order.paymentStatus !== 'completed') {
      order.paymentStatus = 'completed';
      order.orderStatus = 'confirmed';
      await order.save();

      console.log(`Payment confirmed for order ${orderId}`);
    }
  }

  res.json({ received: true });
});

module.exports = router;
