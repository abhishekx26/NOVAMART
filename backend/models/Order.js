const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('stripe', 'cod'),
    defaultValue: 'stripe',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
  orderStatus: {
    type: DataTypes.ENUM('placed', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'placed',
  },
  shippingFullName: DataTypes.STRING,
  shippingStreet: DataTypes.STRING,
  shippingCity: DataTypes.STRING,
  shippingState: DataTypes.STRING,
  shippingPincode: DataTypes.STRING,
  shippingCountry: DataTypes.STRING,
  shippingPhone: DataTypes.STRING,
  stripePaymentIntentId: DataTypes.STRING,
  cancellationReason: DataTypes.TEXT,
  cancelledAt: DataTypes.DATE,
}, {
  timestamps: true,
});

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: DataTypes.STRING,
  price: DataTypes.DECIMAL(10, 2),
  quantity: DataTypes.INTEGER,
  size: DataTypes.STRING,
  color: DataTypes.STRING,
  image: DataTypes.STRING,
}, {
  timestamps: true,
});

// Association
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, OrderItem };
