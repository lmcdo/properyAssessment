import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const Header = ({ user, onUserChange }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLoginClick = () => {
    setLoginOpen(true);
  };

  const handleClose = () => {
    setLoginOpen(false);
  };

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white' }}>
        <Toolbar>
          <Box display="flex" alignItems="center" width="100%" py={2}>
            {/* Logo Space */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 0, color: 'primary.main', fontWeight: 'bold', mr: 2 }}
            >
              PropertyAI
            </Typography>

            {/* Tagline */}
            {!isMobile && (
              <Typography
                variant="subtitle1"
                sx={{ flexGrow: 1, color: 'text.secondary' }}
              >
                Instant Property Development Insights
              </Typography>
            )}

            {/* Login/Signup Button */}
            {user ? (
              <Button
                color="primary"
                onClick={() => onUserChange(null)}
              >
                Logout
              </Button>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                onClick={handleLoginClick}
              >
                Login / Sign Up
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Dialog */}
      <Dialog open={loginOpen} onClose={handleClose}>
        <DialogTitle>Login / Sign Up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} variant="contained">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
