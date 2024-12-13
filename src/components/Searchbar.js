import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import useGoogleMapsAutocomplete from '../hooks/useGoogleMapsAutocomplete';
import './Searchbar.css';

const SearchBar = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 });
  const [zoom, setZoom] = useState(13);
  const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
  const mapRef = useRef(null);
  const { autocompleteRef, autocomplete } = useGoogleMapsAutocomplete();
  const { ready, value, setValue, suggestions: { status, data }, clearSuggestions } = usePlacesAutocomplete({
    initializeOptions: {
      componentRestrictions: { country: 'us' },
    },
  });

  const handleSelect = useCallback(
    async (address) => {
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setAddress(results[0].formatted_address);
      setCoordinates({ lat, lng });
      setZoom(18);
      setIsInfoWindowOpen(true);
    },
    [setValue, clearSuggestions]
  );

  const handleMarkerClick = () => {
    setIsInfoWindowOpen(!isInfoWindowOpen);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="map-container">
      <GoogleMap
        center={coordinates}
        zoom={zoom}
        mapContainerStyle={{ height: '400px' }}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker position={coordinates} onClick={handleMarkerClick}>
          {isInfoWindowOpen && (
            <InfoWindow onCloseClick={() => setIsInfoWindowOpen(false)}>
              <div>{address}</div>
            </InfoWindow>
          )}
        </Marker>
      </GoogleMap>
      <div>
        <input
          value={value}
          onChange={handleInputChange}
          placeholder="Enter an address"
        />
        {ready && status === 'OK' && (
          <ul>
            {data.map(({ place_id, description }) => (
              <li key={place_id} onClick={() => handleSelect(description)}>
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