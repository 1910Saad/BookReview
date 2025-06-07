import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Header from './components/Header';
import BookList from './pages/BookList';
import Signup from './pages/Signup';
import Login from './pages/Login';
import BookDetails from './pages/BookDetails';
import AddBook from './pages/AddBook';
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
