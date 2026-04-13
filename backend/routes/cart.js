const express = require('express');
const { Cart, CartItem, Product } = require('../models/index');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to calculate cart total
async function recalculateCartTotal(cartId) {
  const items = await CartItem.findAll({ where: { cartId } });
  let total = 0;

  for (let item of items) {
    const product = await Product.findByPk(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  await Cart.update({ totalPrice: total }, { where: { id: cartId } });
  return total;
}

// Get user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        totalPrice: 0,
      });
      cart = await Cart.findByPk(cart.id, {
        include: {
          model: CartItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }],
        },
      });
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ error: 'Product ID and quantity are required' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        totalPrice: 0,
      });
    }

    // Check if item already exists with same size and color
    const existingItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId,
        size: size || null,
        color: color || null,
      },
    });

    if (existingItem) {
      await existingItem.increment('quantity', { by: quantity });
    } else {
      await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
        size: size || null,
        color: color || null,
      });
    }

    await recalculateCartTotal(cart.id);

    const updatedCart = await Cart.findByPk(cart.id, {
      include: {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    res.status(201).json({
      message: 'Item added to cart',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/:itemId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Verify the item belongs to user's cart
    const cart = await Cart.findOne({
      where: { id: cartItem.cartId, userId: req.user.id },
    });
    if (!cart) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
    } else {
      await cartItem.update({ quantity });
    }

    await recalculateCartTotal(cart.id);

    const updatedCart = await Cart.findByPk(cart.id, {
      include: {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    res.json({
      message: 'Cart updated',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Remove item from cart
router.delete('/:itemId', authenticateToken, async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Verify the item belongs to user's cart
    const cart = await Cart.findOne({
      where: { id: cartItem.cartId, userId: req.user.id },
    });
    if (!cart) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await cartItem.destroy();
    await recalculateCartTotal(cart.id);

    const updatedCart = await Cart.findByPk(cart.id, {
      include: {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    res.json({
      message: 'Item removed from cart',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear entire cart
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await CartItem.destroy({ where: { cartId: cart.id } });
    await cart.update({ totalPrice: 0 });

    const updatedCart = await Cart.findByPk(cart.id, {
      include: {
        model: CartItem,
        as: 'items',
        include: [{ model: Product, as: 'product' }],
      },
    });

    res.json({
      message: 'Cart cleared',
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
