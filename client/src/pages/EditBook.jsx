import { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditBook = ({ book, onBookUpdated, onCancel }) => {
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    description: book.description || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setForm({
      title: book.title,
      author: book.author,
      description: book.description || ''
    });
  }, [book]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put(`http://localhost:5000/api/books/${book._id}`,
        form,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Book updated!');
      if (onBookUpdated) onBookUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update book');
    }
  };

  return (
    <Box mt={2}>
      <Typography variant="h6" mb={1}>Edit Book</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Author"
          name="author"
          value={form.author}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          minRows={3}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 1, mr: 1 }}>
          Save
        </Button>
        <Button variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </Box>
  );
};

export default EditBook;
