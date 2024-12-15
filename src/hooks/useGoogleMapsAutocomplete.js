import { useRef, useEffect } from 'react';

const useGoogleMapsAutocomplete = () => {
  const autocompleteRef = useRef(null);
  let autocomplete = null;

  useEffect(() => {
    if (!autocompleteRef.current) return;

    autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteRef.current,
      { types: ['address'], componentRestrictions: { country: 'au' } }
    );
  }, []);

  return { autocompleteRef, autocomplete };
};

export default useGoogleMapsAutocomplete;