const { Schema, model } = require('mongoose');
const { sendEmail } = require('../utils/emailService');

const bulkPricingTierSchema = new Schema({
  minQuantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    default: 10,
  },
  category: {
    type: String,
    required: true,
    enum: ['fish', 'shellfish', 'crustaceans', 'other'],
  },
  image: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ['lb', 'kg', 'piece'],
  },
  minimumOrder: {
    type: Number,
    required: true,
    min: 1,
  },
  bulkPricing: [bulkPricingTierSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Method to calculate price based on quantity
productSchema.methods.getPriceForQuantity = function(quantity) {
  if (!this.bulkPricing || this.bulkPricing.length === 0) {
    return this.price * quantity;
  }

  const applicableTier = this.bulkPricing
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find(tier => quantity >= tier.minQuantity);

  return applicableTier ? applicableTier.price * quantity : this.price * quantity;
};

// Middleware to check stock levels after updates
productSchema.post('save', async function() {
  if (this.stock <= this.lowStockThreshold) {
    try {
      // Send low stock alert to admin email
      await sendEmail(
        process.env.ADMIN_EMAIL,
        'lowStockAlert',
        this
      );
    } catch (error) {
      console.error('Error sending low stock alert:', error);
    }
  }
});

const Product = model('Product', productSchema);

module.exports = Product;
