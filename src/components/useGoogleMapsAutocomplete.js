import { useState, useEffect, useRef } from 'react';

const useGoogleMapsAutocomplete = () => {
  const autocompleteRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      console.error('Google Maps script is not loaded');
      return;
    }

    const initAutocomplete = () => {
      const autocompleteSvc = new window.google.maps.places.Autocomplete(autocompleteRef.current);
      setAutocomplete(autocompleteSvc);
    };

    initAutocomplete();
  }, []);

  return { autocompleteRef, autocomplete };
};

export default useGoogleMapsAutocomplete;
