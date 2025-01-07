const cron = require('node-cron');
const RecurringOrderService = require('./recurringOrderService');

// Process recurring orders daily at 1 AM
cron.schedule('0 1 * * *', async () => {
  console.log('Processing recurring orders...');
  await RecurringOrderService.processRecurringOrders();
});

// Send reminders daily at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Sending recurring order reminders...');
  await RecurringOrderService.sendUpcomingReminders();
});

module.exports = {
  startScheduledTasks: () => {
    console.log('Scheduled tasks started');
  }
};
