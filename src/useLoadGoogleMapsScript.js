import { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const useLoadGoogleMapsScript = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: ['places'],
  });

  if (isLoaded && !isScriptLoaded) {
    setIsScriptLoaded(true);
  }

  return isScriptLoaded;
};

export default useLoadGoogleMapsScript; 