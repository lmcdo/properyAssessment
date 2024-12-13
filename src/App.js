// src/App.js
import React, { useState, useEffect } from 'react';
import Propertyhomepage from './components/Propertyhomepage';
import { LoadGoogleMapScript } from './utils/LoadGoogleMapScript';

const App = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadScript = async () => {
      try {
        await LoadGoogleMapScript(process.env.REACT_APP_GOOGLE_MAPS_API_KEY, ['places']);
        setIsScriptLoaded(true);
      } catch (error) {
        console.error('Failed to load Google Maps script:', error);
      }
    };

    loadScript();
  }, []);

  return isScriptLoaded ? <Propertyhomepage /> : <div>Loading...</div>;
};

export default App;