const { Schema, model } = require('mongoose');
const { sendEmail } = require('../utils/emailService');

const recurringOrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
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
  }],
  frequency: {
    type: String,
    required: true,
    enum: ['weekly', 'biweekly', 'monthly'],
  },
  nextDeliveryDate: {
    type: Date,
    required: true,
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
  },
  lastOrderDate: {
    type: Date,
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

// Calculate next delivery date based on frequency
recurringOrderSchema.methods.calculateNextDeliveryDate = function() {
  const today = new Date();
  let nextDate = new Date(this.nextDeliveryDate);

  while (nextDate <= today) {
    switch (this.frequency) {
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'biweekly':
        nextDate.setDate(nextDate.getDate() + 14);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
    }
  }

  return nextDate;
};

// Middleware to update nextDeliveryDate after an order is processed
recurringOrderSchema.methods.updateAfterOrder = async function() {
  this.lastOrderDate = new Date();
  this.nextDeliveryDate = this.calculateNextDeliveryDate();
  await this.save();
};

// Send reminder email before next delivery
recurringOrderSchema.methods.sendDeliveryReminder = async function() {
  try {
    await this.populate('user items.product');
    await sendEmail(
      this.user.email,
      'recurringOrderReminder',
      {
        recurringOrder: this,
        items: this.items,
        nextDeliveryDate: this.nextDeliveryDate,
      }
    );
  } catch (error) {
    console.error('Error sending recurring order reminder:', error);
  }
};

const RecurringOrder = model('RecurringOrder', recurringOrderSchema);

module.exports = RecurringOrder;
