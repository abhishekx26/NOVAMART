const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
    },
  },
  mrp: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: true,
    },
  },
  discount: {
    type: DataTypes.STRING(100),
    defaultValue: '0% OFF',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0,
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  category: {
    type: DataTypes.ENUM('mens', 'womens', 'kids'),
    allowNull: false,
    validate: {
      isIn: [['mens', 'womens', 'kids']],
    },
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  colors: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  sizes: {
    type: DataTypes.JSON,
    defaultValue: ['M', 'L', 'XL', 'XXL'],
  },
  inventory: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['category', 'price', 'rating'],
    },
    {
      fields: ['title'],
      type: 'FULLTEXT',
    },
  ],
});

module.exports = Product;
