const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, OrderItem, Product } = require('../models/index');
const { authenticateToken } = require('../middleware/auth');
const { sendEmail } = require('../config/email');

const router = express.Router();

// Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId: orderId.toString(),
        userId: req.user.id.toString(),
      },
    });

    await order.update({ stripePaymentIntentId: paymentIntent.id });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm', authenticateToken, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await Order.findByPk(orderId, {
      include: {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      await order.update({
        paymentStatus: 'completed',
        orderStatus: 'confirmed',
      });

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
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
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

      const order = await Order.findByPk(orderId);
      if (order && order.paymentStatus !== 'completed') {
        await order.update({
          paymentStatus: 'completed',
          orderStatus: 'confirmed',
        });

        console.log(`Payment confirmed for order ${orderId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
