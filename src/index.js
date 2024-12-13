import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import useLoadGoogleMapsScript from './useLoadGoogleMapsScript';

const root = ReactDOM.createRoot(document.getElementById('root'));

const LoadGoogleMapsScript = () => {
  const isScriptLoaded = useLoadGoogleMapsScript();

  if (!isScriptLoaded) {
    return <div>Loading...</div>;
  }

  return <App />;
};

root.render(<LoadGoogleMapsScript />);
