import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LoadGoogleMapScript } from './utils/LoadGoogleMapScript';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

LoadGoogleMapScript(API_KEY)
  .then(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((error) => {
    console.error('Error loading Google Maps script:', error);
  });
