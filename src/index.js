import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import useGoogleMapsAutocomplete from './hooks/useGoogleMapsAutocomplete';

const root = ReactDOM.createRoot(document.getElementById('root'));

const LoadGoogleMapsScript = () => {
  const isScriptLoaded = useGoogleMapsAutocomplete();

  if (!isScriptLoaded) {
    return <div>Loading...</div>;
  }

  return <App />;
};

root.render(<LoadGoogleMapsScript />);
