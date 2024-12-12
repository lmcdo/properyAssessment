   import { useState, useEffect, useRef } from 'react';
   import { googleMapsScript } from '../utils/LoadGoogleMapScript';

   const useGoogleMapsAutocomplete = () => {
     const autocompleteRef = useRef(null);
     const [autocomplete, setAutocomplete] = useState(null);

     useEffect(() => {
       if (!googleMapsScript) {
         console.error('Google Maps script is not loaded');
         return;
       }

       const initAutocomplete = () => {
         const autocompleteSvc = new googleMapsScript.places.Autocomplete(autocompleteRef.current);
         setAutocomplete(autocompleteSvc);
       };

       initAutocomplete();
     }, []);

     return { autocompleteRef, autocomplete };
   };

   export default useGoogleMapsAutocomplete;