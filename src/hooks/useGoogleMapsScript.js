import { useState, useEffect } from 'react';
import _ from 'lodash';

const useGoogleMapsScript = () => {
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      window.google = window.google || {};
      window.google.maps = window.google.maps || {};

      script.onload = () => {
        setGoogle(window.google.maps);
      };

      document.body.appendChild(script);
    };

    _.once(loadGoogleMapsScript)();
  }, []);

  return google;
};

export default useGoogleMapsScript;