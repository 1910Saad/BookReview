import { useState } from 'react';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import axios from 'axios';

const AddReview = ({ bookId, onReviewAdded }) => {
  const [form, setForm] = useState({ comment: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(`http://localhost:5000/api/books/${bookId}/reviews`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Review added!');
      setForm({ comment: '' });
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6" mb={1}>Add a Review</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Your Review"
          name="comment"
          value={form.comment}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          minRows={2}
          required
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
          Submit Review
        </Button>
      </form>
    </Box>
  );
};

export default AddReview;
