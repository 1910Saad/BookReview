import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, onLogout }) => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
        Book Review
      </Typography>
      <Box>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/add-book">Add Book</Button>
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
          </>
        )}
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
