import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useGoogleMapsAutocomplete from '../hooks/useGoogleMapsAutocomplete';

const SearchBar = ({ onAddressSelect }) => {
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 });
  const [zoom, setZoom] = useState(13);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const mapRef = useRef(null);
  const { autocompleteRef, autocomplete } = useGoogleMapsAutocomplete();
  const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete({
    initializeOptions: {
      componentRestrictions: { country: 'au' },
    },
  });


  const handleSelect = useCallback(
    async (address) => {
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setCoordinates({ lat, lng });
      setZoom(18);
      setIsInfoWindowOpen(true);
      onAddressSelect({ address: results[0].formatted_address, lat, lng });
    },
    [setValue, clearSuggestions, onAddressSelect]
  );

  const handleMarkerClick = () => {
    setIsInfoWindowOpen(!isInfoWindowOpen);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <GoogleMap
          center={coordinates}
          zoom={zoom}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          onLoad={(map) => (mapRef.current = map)}
        >
          <Marker position={coordinates} onClick={handleMarkerClick}>
            {isInfoWindowOpen && <InfoWindow onCloseClick={() => setIsInfoWindowOpen(false)}><div>{value}</div></InfoWindow>}
          </Marker>
        </GoogleMap>
      </div>
      <div style={{ padding: '10px' }}>
        <input
          value={value}
          onChange={handleInputChange}
          placeholder="Enter an address"
          ref={autocompleteRef}
          style={{ width: '100%' }}
        />
        {ready && status === 'OK' && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                style={{ cursor: 'pointer' }}
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar;