import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Header from './Header';
import BookList from './BookList';
import Signup from './Signup';
import Login from './Login';
import BookDetails from './BookDetails';
import AddBook from './AddBook';
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const isAuthenticated = !!token;

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <CssBaseline />
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/add-book" element={isAuthenticated ? <AddBook /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
