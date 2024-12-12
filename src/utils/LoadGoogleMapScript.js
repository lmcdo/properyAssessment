let googleMapsScriptLoaded = false;
let googleMapsScript;

const LoadGoogleMapScript = (apiKey) => {
  if (googleMapsScriptLoaded) return Promise.resolve();

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&async=true`;
  script.async = true;
  script.defer = true;

  return new Promise((resolve, reject) => {
    script.onload = () => {
      googleMapsScriptLoaded = true;
      googleMapsScript = window.google.maps;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });
};

export { LoadGoogleMapScript, googleMapsScript };
