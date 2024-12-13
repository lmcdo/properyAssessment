import { useState, useEffect, useRef } from 'react';
import { useGoogleMapsScript } from '@react-google-maps/api';

const useGoogleMapsAutocomplete = () => {
  const autocompleteRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded } = useGoogleMapsScript();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const initAutocomplete = () => {
      const autocompleteSvc = new google.maps.places.Autocomplete(autocompleteRef.current);
      setAutocomplete(autocompleteSvc);
    };

    initAutocomplete();
  }, [isLoaded]);

  return { autocompleteRef, autocomplete };
};

export default useGoogleMapsAutocomplete;