import React from 'react';
import { CircularProgress } from '@mui/material';

const LoadingIndicator = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={60} />
    </div>
  );
};

export default LoadingIndicator;