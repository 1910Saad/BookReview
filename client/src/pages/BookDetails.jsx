import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Button, Card, CardContent, IconButton } from '@mui/material';
import axios from 'axios';
import AddReview from './AddReview';
import EditReview from './EditReview';
import EditBook from './EditBook';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingBook, setEditingBook] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(res.data.book || res.data); // support both {book} and book
      } catch (err) {
        setError('Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    // Get userId from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id);
      } catch {}
    }
    fetchBook();
  }, [id, refresh]);

  useEffect(() => {
    if (book && userId) {
      console.log('book.authorId:', book.authorId, 'typeof:', typeof book.authorId);
      console.log('userId:', userId, 'typeof:', typeof userId);
    }
  }, [book, userId]);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRefresh(r => !r);
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/');
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!book) return <Alert severity="warning">Book not found</Alert>;

  return (
    <Box maxWidth={700} mx="auto" mt={8}>
      {editingBook ? (
        <EditBook
          book={book}
          onBookUpdated={() => { setEditingBook(false); setRefresh(r => !r); }}
          onCancel={() => setEditingBook(false)}
        />
      ) : (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h4" mb={1}>{book.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">by {book.author}</Typography>
            <Typography variant="body1" mt={2}>{book.description}</Typography>
            {userId && (book.authorId?.toString() === userId || book.authorId === userId) && (
              <Box mt={2}>
                <Button startIcon={<EditIcon />} onClick={() => setEditingBook(true)} sx={{ mr: 1 }}>Edit</Button>
                <Button startIcon={<DeleteIcon />} color="error" onClick={handleDeleteBook}>Delete</Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      <Typography variant="h5" mb={2}>Reviews</Typography>
      {book.reviews && book.reviews.length === 0 && <Typography>No reviews yet.</Typography>}
      {book.reviews && book.reviews.map(review => (
        <Card key={review._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2">{review.user?.username || 'User'}</Typography>
            {editingReviewId === review._id ? (
              <EditReview
                bookId={book._id}
                review={review}
                onReviewUpdated={() => { setEditingReviewId(null); setRefresh(r => !r); }}
                onCancel={() => setEditingReviewId(null)}
              />
            ) : (
              <>
                <Typography variant="body2" mt={1}>{review.comment}</Typography>
                {userId && review.user && review.user._id === userId && (
                  <Box mt={1}>
                    <Button startIcon={<EditIcon />} onClick={() => setEditingReviewId(review._id)} sx={{ mr: 1 }}>Edit</Button>
                    <Button startIcon={<DeleteIcon />} color="error" onClick={() => handleDeleteReview(review._id)}>Delete</Button>
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
      {userId && !book.reviews?.some(r => r.user && r.user._id === userId) && (
        <AddReview bookId={book._id} onReviewAdded={() => setRefresh(r => !r)} />
      )}
    </Box>
  );
};

export default BookDetails;
