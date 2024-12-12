import React, { useState, useRef } from 'react';
import { Map, Marker, APIProvider } from '@vis.gl/react-google-maps';
import { googleMapsScript } from '../utils/LoadGoogleMapScript';

const SearchBar = () => {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: -33.8688, lng: 151.2093 });
  const [zoom, setZoom] = useState(6);
  const [marker, setMarker] = useState(null);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const handleSelect = async (value) => {
    if (!googleMapsScript) {
      console.error('Google Maps script is not loaded');
      return;
    }

    const geocoder = new googleMapsScript.Geocoder();
    geocoder.geocode({ address: value }, (results, status) => {
      if (status === 'OK') {
        const latLng = results[0].geometry.location;
        setAddress(value);
        setCoordinates(latLng);
        setZoom(18);
        setMarker(<Marker position={latLng} />);
        mapRef.current?.panTo(latLng);
      } else {
        console.error('Geocode was not successful for the following reason:', status);
        setMarker(null);
        setZoom(6);
      }
    });
  };

  const handleChange = (value) => {
    setAddress(value);
  };

  const initAutocomplete = () => {
    if (!googleMapsScript) {
      console.error('Google Maps script is not loaded');
      return;
    }

    const autocomplete = new googleMapsScript.places.Autocomplete(autocompleteRef.current);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        handleSelect(place.formatted_address);
      } else {
        console.error('No geometry found for the selected place');
        setMarker(null);
        setZoom(6);
      }
    });
  };

  React.useEffect(() => {
    if (googleMapsScript) {
      initAutocomplete();
    }
  }, [googleMapsScript]);

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Map
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={coordinates}
          zoom={zoom}
          ref={mapRef}
        >
          {marker}
        </Map>
        <input
          ref={autocompleteRef}
          value={address}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search for a location in NSW..."
          style={{
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '240px',
            height: '32px',
            padding: '0 12px',
            borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            outline: 'none',
            textOverflow: 'ellipses',
          }}
        />
      </div>
    </APIProvider>
  );
};

export default SearchBar;