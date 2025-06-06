import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress, Divider, List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import axios from 'axios';
import AddReview from './AddReview';
import EditReview from './EditReview';
import EditBook from './EditBook';
import DeleteIcon from '@mui/icons-material/Delete';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editingBook, setEditingBook] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/books/${id}`)
      .then(res => {
        // Patch: add currentUser to book and reviews for UI logic
        const token = localStorage.getItem('token');
        let currentUser = null;
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            currentUser = payload.id;
          } catch {}
        }
        // Attach currentUser to book and reviews for UI
        const bookData = { ...res.data, currentUser };
        if (bookData.reviews) {
          bookData.reviews = bookData.reviews.map(r => ({
            ...r,
            userId: r.user._id || r.user,
            username: r.user.username || r.user
          }));
        }
        setBook(bookData);
      })
      .catch(() => setError('Book not found'))
      .finally(() => setLoading(false));
  }, [id, refresh]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRefresh(r => !r);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleDeleteBook = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      window.location.href = '/';
    } catch (err) {
      // Optionally handle error
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Box mt={4}><Typography color="error">{error}</Typography></Box>;
  if (!book) return null;

  return (
    <Box mt={4}>
      <Card>
        <CardContent>
          {editingBook ? (
            <EditBook
              book={book}
              onBookUpdated={() => { setEditingBook(false); setRefresh(r => !r); }}
              onCancel={() => setEditingBook(false)}
            />
          ) : (
            <>
              <Typography variant="h4" mb={2}>{book.title}</Typography>
              <Typography variant="subtitle1" mb={1}>by {book.author}</Typography>
              <Typography variant="body2" mb={2}>{book.description}</Typography>
              {localStorage.getItem('token') && book.currentUser === book.author && (
                <Box mb={2}>
                  <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => setEditingBook(true)}>
                    Edit Book
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleDeleteBook}>
                    Delete Book
                  </Button>
                </Box>
              )}
            </>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Reviews</Typography>
          <List>
            {book.reviews && book.reviews.length > 0 ? (
              book.reviews.map((review, idx) => (
                <ListItem key={idx} alignItems="flex-start"
                  secondaryAction={
                    (localStorage.getItem('token') && review.userId === book.currentUser) && (
                      <>
                        <IconButton edge="end" aria-label="edit" onClick={() => setEditingReviewId(review._id)}>
                          <span role="img" aria-label="edit">✏️</span>
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReview(review._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )
                  }
                >
                  {editingReviewId === review._id ? (
                    <EditReview
                      bookId={id}
                      review={review}
                      onReviewUpdated={() => { setEditingReviewId(null); setRefresh(r => !r); }}
                      onCancel={() => setEditingReviewId(null)}
                    />
                  ) : (
                    <ListItemText
                      primary={review.username}
                      secondary={review.comment}
                    />
                  )}
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No reviews yet.</Typography>
            )}
          </List>
          {localStorage.getItem('token') && (
            <AddReview bookId={id} onReviewAdded={() => setRefresh(r => !r)} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookDetails;
