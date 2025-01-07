const RecurringOrder = require('../models/RecurringOrder');
const RecurringOrderService = require('../utils/recurringOrderService');

async function testRecurringOrders() {
  try {
    // Test creating a recurring order
    const testOrder = new RecurringOrder({
      user: '507f1f77bcf86cd799439011', // Replace with a valid user ID
      items: [{
        product: '507f1f77bcf86cd799439012', // Replace with a valid product ID
        quantity: 2
      }],
      frequency: 'weekly',
      nextDeliveryDate: new Date(),
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      }
    });

    await testOrder.save();
    console.log('Test recurring order created:', testOrder);

    // Test calculating next delivery date
    const nextDate = testOrder.calculateNextDeliveryDate();
    console.log('Next delivery date calculated:', nextDate);

    // Test pausing order
    const pausedOrder = await RecurringOrderService.pauseOrder(testOrder._id);
    console.log('Order paused:', pausedOrder);

    // Test resuming order
    const resumedOrder = await RecurringOrderService.resumeOrder(testOrder._id);
    console.log('Order resumed:', resumedOrder);

    // Clean up test data
    await RecurringOrder.findByIdAndDelete(testOrder._id);
    console.log('Test data cleaned up');

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run tests
testRecurringOrders();
