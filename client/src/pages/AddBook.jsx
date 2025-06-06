import { useState } from 'react';
import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
  const [form, setForm] = useState({ title: '', author: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.title || !form.author) {
      setError('Title and Author are required');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/books', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Book added successfully!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <Box maxWidth={500} mx="auto" mt={11}>
      <Typography variant="h4" mb={1} align='center'>Add New Book</Typography>
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
        {/* Optionally add genre or other fields here if backend supports */}
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, mb:4 }}>
          Add Book
        </Button>
      </form>
    </Box>
  );
};

export default AddBook;
