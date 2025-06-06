const express = require('express');
const Review = require('../models/Review');
const Book = require('../models/Book');
const { authenticate } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// Add review
router.post('/', authenticate, async (req, res) => {
  try {
    const { comment } = req.body;
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    const review = await Review.create({
      user: req.user._id,
      comment,
      book: book._id
    });
    book.reviews.push(review._id);
    await book.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review
router.put('/:reviewId', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    review.comment = req.body.comment;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review
router.delete('/:reviewId', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Book.findByIdAndUpdate(review.book, { $pull: { reviews: review._id } });
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
