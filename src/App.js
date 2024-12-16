// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Propertyhomepage from './components/Propertyhomepage';
import PropertyDetails from './components/PropertyDetails';
import { LoadGoogleMapScript } from './utils/LoadGoogleMapScript';
import SharedProperty from './components/SharedProperty';


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

  return isScriptLoaded ? (
    <Router>
      <Routes>
        <Route path="/" element={<Propertyhomepage />} />
        <Route path="/property-details" element={<PropertyDetails />} />
        <Route path="/shared-property" element={<SharedProperty />} />
      </Routes>
    </Router>
  ) : (
    <div>Loading...</div>
  );
};

export default App;