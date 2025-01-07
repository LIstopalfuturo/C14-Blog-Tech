const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
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

// Update product average rating when a review is added or modified
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const Product = require('./Product');
  
  const stats = await Review.aggregate([
    { $match: { product: this.product } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(this.product, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await Product.findByIdAndUpdate(this.product, {
      averageRating: 0,
      numReviews: 0
    });
  }
});

const Review = model('Review', reviewSchema);

module.exports = Review;
