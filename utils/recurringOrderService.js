const RecurringOrder = require('../models/RecurringOrder');
const Order = require('../models/Order');
const { sendEmail } = require('./emailService');

class RecurringOrderService {
  // Process all due recurring orders
  static async processRecurringOrders() {
    try {
      const today = new Date();
      const dueOrders = await RecurringOrder.find({
        status: 'active',
        nextDeliveryDate: { $lte: today }
      }).populate('user items.product');

      for (const recurringOrder of dueOrders) {
        await this.processOrder(recurringOrder);
      }
    } catch (error) {
      console.error('Error processing recurring orders:', error);
    }
  }

  // Process a single recurring order
  static async processOrder(recurringOrder) {
    try {
      // Create new order from recurring order
      const newOrder = new Order({
        user: recurringOrder.user._id,
        items: recurringOrder.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: recurringOrder.shippingAddress,
        total: recurringOrder.items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        ),
      });

      await newOrder.save();

      // Update recurring order
      await recurringOrder.updateAfterOrder();

      // Send confirmation email
      await sendEmail(
        recurringOrder.user.email,
        'recurringOrderProcessed',
        {
          items: recurringOrder.items,
          nextDeliveryDate: recurringOrder.nextDeliveryDate,
        }
      );

    } catch (error) {
      console.error('Error processing recurring order:', error);
      throw error;
    }
  }

  // Send reminders for upcoming orders
  static async sendUpcomingReminders() {
    try {
      const reminderDate = new Date();
      reminderDate.setDate(reminderDate.getDate() + 2); // 2 days before delivery

      const upcomingOrders = await RecurringOrder.find({
        status: 'active',
        nextDeliveryDate: {
          $gte: new Date(),
          $lte: reminderDate
        }
      }).populate('user items.product');

      for (const order of upcomingOrders) {
        await order.sendDeliveryReminder();
      }
    } catch (error) {
      console.error('Error sending recurring order reminders:', error);
    }
  }

  // Pause a recurring order
  static async pauseOrder(orderId) {
    try {
      const order = await RecurringOrder.findById(orderId);
      if (!order) throw new Error('Recurring order not found');

      order.status = 'paused';
      await order.save();

      return order;
    } catch (error) {
      console.error('Error pausing recurring order:', error);
      throw error;
    }
  }

  // Resume a recurring order
  static async resumeOrder(orderId) {
    try {
      const order = await RecurringOrder.findById(orderId);
      if (!order) throw new Error('Recurring order not found');

      order.status = 'active';
      order.nextDeliveryDate = order.calculateNextDeliveryDate();
      await order.save();

      return order;
    } catch (error) {
      console.error('Error resuming recurring order:', error);
      throw error;
    }
  }

  // Cancel a recurring order
  static async cancelOrder(orderId) {
    try {
      const order = await RecurringOrder.findById(orderId);
      if (!order) throw new Error('Recurring order not found');

      order.status = 'cancelled';
      await order.save();

      return order;
    } catch (error) {
      console.error('Error cancelling recurring order:', error);
      throw error;
    }
  }
}

module.exports = RecurringOrderService;
