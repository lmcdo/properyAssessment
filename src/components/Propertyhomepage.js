import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchBar from './Searchbar';

const locations = [
  { lat: -33.865143, lng: 151.209900, name: 'Sydney Opera House' },
  { lat: -33.856667, lng: 151.215530, name: 'Circular Quay' },
];

const Propertyhomepage = () => {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const mapStyles = {
    height: '50vh',
    width: '50vw',
  };

  const defaultCenter = {
    lat: -33.860664,
    lng: 151.208138,
  };

  return (
    <div>
      <header style={{ height: '60px', backgroundColor: '#f0f0f0', padding: '10px' }}>
        <h1>Sydney Landmarks</h1>
      </header>
      <SearchBar />
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
        >
          {locations.map((location, index) => (
            <Marker key={index} position={location} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Propertyhomepage;