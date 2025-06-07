const express = require('express');
const Book = require('../models/Book');
const Review = require('../models/Review');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get books with search and pagination
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 4 } = req.query;
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate({ path: 'reviews', populate: { path: 'user', select: 'username' } });
    res.json({ books, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /search – Search books by title or author (partial and case-insensitive)
router.get('/search', async (req, res) => {
  try {
    const { q = '', page = 1, limit = 4 } = req.query;
    const query = q ? {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ]
    } : {};
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate({ path: 'reviews', populate: { path: 'user', select: 'username' } });
    res.json({ books, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /books/:id/reviews – Submit a review (Authenticated users only, one review per user per book)
router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({ message: 'Comment is required' });
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    // Check if user already reviewed this book
    const existingReview = await Review.findOne({ book: book._id, user: req.user._id });
    if (existingReview) return res.status(400).json({ message: 'You have already reviewed this book' });
    const review = await Review.create({
      user: req.user._id,
      comment: comment.trim(),
      book: book._id
    });
    book.reviews.push(review._id);
    await book.save();
    // Populate user field for immediate client use
    await review.populate({ path: 'user', select: 'username' });
    res.status(201).json(review);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /books/:id – Get book details by ID, including average rating and paginated reviews
router.get('/:id', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const book = await Book.findById(req.params.id)
      .populate({ path: 'reviews', populate: { path: 'user', select: 'username' } });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create book
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, author, description } = req.body;
    if (!title || !author) return res.status(400).json({ message: 'Title and author required' });
    const book = await Book.create({
      title,
      author,
      description,
      authorId: req.user._id,
      reviews: []
    });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update book
router.put('/:id', authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, author, description } = req.body;
    book.title = title;
    book.author = author;
    book.description = description;
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete book
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Delete all reviews for this book
    await Review.deleteMany({ book: book._id });
    await book.deleteOne();
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /reviews/:id – Update your own review
router.put('/reviews/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
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

// DELETE /reviews/:id – Delete your own review
router.delete('/reviews/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
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
