import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Grid, InputAdornment, TextField as MuiTextField, Pagination } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/books', {
      params: { search, page }
    })
      .then(res => {
        setBooks(res.data.books || res.data); // support both array and paginated
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, [search, page]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Box width="100%" maxWidth={1000}>
        <Typography variant="h4" mb={3} align="center">Book List</Typography>
        <MuiTextField
          placeholder="Search books..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
          sx={{ mb: 3 }}
        />
        <Grid container spacing={3} justifyContent="center">
          {books.map(book => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book._id} display="flex">
              <Card sx={{ width: '100%', minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h6" component={Link} to={`/books/${book._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">by {book.author}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="center" mt={4} mb={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BookList;
