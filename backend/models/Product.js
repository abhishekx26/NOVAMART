const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    mrp: {
      type: Number,
      required: [true, 'Please provide MRP'],
    },
    discount: {
      type: String, // e.g., "20% OFF"
      default: '0% OFF',
    },
    rating: {
      type: String, // e.g., "4.5"
      default: '0',
    },
    ratingCount: {
      type: String,
      default: '0',
    },
    category: {
      type: String,
      enum: ['mens', 'womens', 'kids'],
      required: [true, 'Please provide category'],
    },
    images: [
      {
        type: String, // Array of image URLs/paths
      },
    ],
    colors: [
      {
        type: String, // Array of color variant images
      },
    ],
    sizes: {
      type: [String],
      default: ['M', 'L', 'XL', 'XXL'],
    },
    inventory: {
      type: Number,
      default: 50,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for search and filtering
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1, rating: 1 });

module.exports = mongoose.model('Product', productSchema);
