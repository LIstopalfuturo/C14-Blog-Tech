const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailTemplates = {
  orderConfirmation: (order) => ({
    subject: `Order Confirmation #${order._id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order #${order._id} has been received and is being processed.</p>
      <h2>Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 12px; border: 1px solid #dee2e6;">Product</th>
            <th style="padding: 12px; border: 1px solid #dee2e6;">Quantity</th>
            <th style="padding: 12px; border: 1px solid #dee2e6;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${item.product.name}</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${item.quantity} ${item.product.unit}</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px; border: 1px solid #dee2e6; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 12px; border: 1px solid #dee2e6;">$${order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <h2>Shipping Address:</h2>
      <p>
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
        ${order.shippingAddress.country}
      </p>
    `,
  }),

  orderStatusUpdate: (order) => ({
    subject: `Order Status Update #${order._id}`,
    html: `
      <h1>Your Order Status Has Been Updated</h1>
      <p>Your order #${order._id} is now: <strong>${order.status}</strong></p>
      <p>Track your order or view details by logging into your account.</p>
    `,
  }),

  lowStockAlert: (product) => ({
    subject: `Low Stock Alert: ${product.name}`,
    html: `
      <h1>Low Stock Alert</h1>
      <p>The following product is running low on stock:</p>
      <p><strong>${product.name}</strong></p>
      <p>Current stock level: ${product.stock} ${product.unit}</p>
      <p>Please restock soon to avoid stockouts.</p>
    `,
  }),

  recurringOrderReminder: (data) => ({
    subject: 'Upcoming Recurring Order Delivery',
    html: `
      <h1>Your Next Recurring Order Delivery</h1>
      <p>Your next recurring order is scheduled for delivery on: <strong>${new Date(data.nextDeliveryDate).toLocaleDateString()}</strong></p>
      
      <h2>Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 12px; border: 1px solid #dee2e6;">Product</th>
            <th style="padding: 12px; border: 1px solid #dee2e6;">Quantity</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${item.product.name}</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${item.quantity} ${item.product.unit}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <p>If you need to make any changes to your recurring order, please log in to your account at least 24 hours before the delivery date.</p>
      
      <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="margin: 0;"><strong>Note:</strong> Your card will be charged automatically when the order is processed.</p>
      </div>
    `,
  }),

  recurringOrderProcessed: (data) => ({
    subject: 'Recurring Order Processed',
    html: `
      <h1>Your Recurring Order Has Been Processed</h1>
      <p>We've processed your recurring order and it will be delivered according to your scheduled delivery date.</p>
      
      <h2>Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="padding: 12px; border: 1px solid #dee2e6;">Product</th>
            <th style="padding: 12px; border: 1px solid #dee2e6;">Quantity</th>
            <th style="padding: 12px; border: 1px solid #dee2e6;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${item.product.name}</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">${item.quantity} ${item.product.unit}</td>
              <td style="padding: 12px; border: 1px solid #dee2e6;">$${(item.product.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <p>Your next recurring order will be delivered on: <strong>${new Date(data.nextDeliveryDate).toLocaleDateString()}</strong></p>
    `,
  }),
};

const sendEmail = async (to, template, data) => {
  try {
    const { subject, html } = emailTemplates[template](data);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully: ${template} to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
