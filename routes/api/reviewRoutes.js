const router = require('express').Router();
const { Review, Product } = require('../../models');
const auth = require('../../middleware/auth');

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      user: req.user.id,
      product,
      rating,
      comment,
    });

    await review.save();

    // Populate user information before sending response
    await review.populate('user', 'name');

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a review
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { rating, comment } = req.body;
    review.rating = rating;
    review.comment = comment;
    review.updatedAt = Date.now();

    await review.save();
    await review.populate('user', 'name');

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await review.remove();
    res.json({ message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
