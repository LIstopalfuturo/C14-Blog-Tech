const { Schema, model } = require('mongoose');
const { sendEmail } = require('../utils/emailService');

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
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

// Middleware to send order confirmation email
orderSchema.post('save', async function() {
  if (this.isNew) {
    try {
      await this.populate('user items.product');
      await sendEmail(
        this.user.email,
        'orderConfirmation',
        this
      );
    } catch (error) {
      console.error('Error sending order confirmation:', error);
    }
  }
});

// Middleware to send order status update email
orderSchema.pre('save', async function(next) {
  if (this.isModified('status') && !this.isNew) {
    try {
      await this.populate('user items.product');
      await sendEmail(
        this.user.email,
        'orderStatusUpdate',
        this
      );
    } catch (error) {
      console.error('Error sending status update:', error);
    }
  }
  next();
});

const Order = model('Order', orderSchema);

module.exports = Order;
