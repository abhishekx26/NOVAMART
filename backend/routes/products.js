const express = require('express');
const { Op } = require('sequelize');
const { Product } = require('../models/index');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    let where = { isActive: true };

    if (category) {
      where.category = category.toLowerCase();
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let orderClause = [['rating', 'DESC']]; // Default: by rating

    if (sort === 'price_asc') orderClause = [['price', 'ASC']];
    else if (sort === 'price_desc') orderClause = [['price', 'DESC']];
    else if (sort === 'newest') orderClause = [['createdAt', 'DESC']];

    const { count, rows } = await Product.findAndCountAll({
      where,
      order: orderClause,
      offset,
      limit: parseInt(limit),
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      products: rows,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Product.findAndCountAll({
      where: {
        category: category.toLowerCase(),
        isActive: true,
      },
      offset,
      limit: parseInt(limit),
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      products: rows,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Search products
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Product.findAndCountAll({
      where: {
        title: {
          [Op.like]: `%${query}%`,
        },
        isActive: true,
      },
      offset,
      limit: parseInt(limit),
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / parseInt(limit)),
      products: rows,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Failed to search products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add product (admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      productId,
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
      sizes,
      description,
      inventory,
    } = req.body;

    const product = await Product.create({
      productId,
      title,
      brand,
      price,
      mrp,
      discount,
      rating,
      ratingCount,
      category,
      images: typeof images === 'string' ? images : JSON.stringify(images),
      colors: typeof colors === 'string' ? colors : JSON.stringify(colors),
      sizes: typeof sizes === 'string' ? sizes : JSON.stringify(sizes),
      description,
      inventory,
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update(req.body);

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({ isActive: false });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
