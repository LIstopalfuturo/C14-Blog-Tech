const router = require('express').Router();
const RecurringOrder = require('../../models/RecurringOrder');
const RecurringOrderService = require('../../utils/recurringOrderService');
const auth = require('../../middleware/auth');

// Get user's recurring orders
router.get('/', auth, async (req, res) => {
  try {
    const recurringOrders = await RecurringOrder.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(recurringOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new recurring order
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      frequency,
      nextDeliveryDate,
      shippingAddress,
    } = req.body;

    const recurringOrder = new RecurringOrder({
      user: req.user.id,
      items,
      frequency,
      nextDeliveryDate: new Date(nextDeliveryDate),
      shippingAddress,
    });

    await recurringOrder.save();
    await recurringOrder.populate('items.product');

    res.status(201).json(recurringOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a recurring order
router.put('/:id', auth, async (req, res) => {
  try {
    const recurringOrder = await RecurringOrder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!recurringOrder) {
      return res.status(404).json({ message: 'Recurring order not found' });
    }

    const {
      items,
      frequency,
      nextDeliveryDate,
      shippingAddress,
    } = req.body;

    if (items) recurringOrder.items = items;
    if (frequency) recurringOrder.frequency = frequency;
    if (nextDeliveryDate) recurringOrder.nextDeliveryDate = new Date(nextDeliveryDate);
    if (shippingAddress) recurringOrder.shippingAddress = shippingAddress;

    await recurringOrder.save();
    await recurringOrder.populate('items.product');

    res.json(recurringOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Pause a recurring order
router.post('/:id/pause', auth, async (req, res) => {
  try {
    const recurringOrder = await RecurringOrder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!recurringOrder) {
      return res.status(404).json({ message: 'Recurring order not found' });
    }

    const updatedOrder = await RecurringOrderService.pauseOrder(req.params.id);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Resume a recurring order
router.post('/:id/resume', auth, async (req, res) => {
  try {
    const recurringOrder = await RecurringOrder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!recurringOrder) {
      return res.status(404).json({ message: 'Recurring order not found' });
    }

    const updatedOrder = await RecurringOrderService.resumeOrder(req.params.id);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a recurring order
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const recurringOrder = await RecurringOrder.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!recurringOrder) {
      return res.status(404).json({ message: 'Recurring order not found' });
    }

    const updatedOrder = await RecurringOrderService.cancelOrder(req.params.id);
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
