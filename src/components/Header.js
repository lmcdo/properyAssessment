import React, { useState, useEffect } from 'react';
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
import { signInWithGoogle, signInWithEmailAndPassword, signUpWithEmailAndPassword, auth } from './firebase';

const Header = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleSignUpClick = () => {
    setIsSignUp(true);
    setLoginOpen(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
    setLoginOpen(true);
  };

  const handleClose = () => {
    setLoginOpen(false);
    setEmail('');
    setPassword('');
    setEmailError(false);
    setPasswordError(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      handleClose();
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (!email) {
      setEmailError(true);
      return;
    }

    if (!password) {
      setPasswordError(true);
      return;
    }

    if (email && password) {
      try {
        if (isSignUp) {
          await signUpWithEmailAndPassword(email, password);
          console.log('Sign-up successful');
        } else {
          await signInWithEmailAndPassword(email, password);
          console.log('Email login successful');
        }
        handleClose();
      } catch (error) {
        console.error('Email authentication error:', error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
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
              <Box display="flex" alignItems="center">
                <Typography variant="body1" mr={2}>
                  {user.email}
                </Typography>
                <Button color="primary" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </Box>
            ) : (
              <>
                <Button color="primary" variant="outlined" onClick={handleSignInClick}>
                  Sign In
                </Button>
                <Button color="primary" variant="contained" onClick={handleSignUpClick} sx={{ ml: 2 }}>
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login/Sign Up Dialog */}
      <Dialog open={loginOpen} onClose={handleClose}>
        <DialogTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Button variant="contained" onClick={handleGoogleLogin}>
              {isSignUp ? 'Sign Up with Google' : 'Login with Google'}
            </Button>
            <form onSubmit={handleEmailSubmit}>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? 'Please enter your email' : ''}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? 'Please enter your password' : ''}
              />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
