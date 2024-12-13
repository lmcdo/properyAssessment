import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import SearchBar from './Searchbar';
import AddressInput from './AddressInput';

const libraries = ['places'];

const Propertyhomepage = () => {
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [mapCenter, setMapCenter] = useState({ lat: -33.860664, lng: 151.208138 });
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedAddress, setSelectedAddress] = useState('');

  const mapStyles = {
    height: '50vh',
    width: '100%',
  };

  const handleAddressSelect = ({ address, lat, lng }) => {
    setSelectedAddress(address);
    setMapCenter({ lat, lng });
    setMapZoom(18);
  };

  return (
    <div>
      <header style={{ height: '60px', backgroundColor: '#f0f0f0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Zoning Explorer</h1>
        <div>
          <AddressInput isEditable={false} label="Map Address" address={selectedAddress} />
          <button>Get Property</button>
        </div>
      </header>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={mapZoom}
        center={mapCenter}
      >
        <Marker position={mapCenter} />
      </GoogleMap>
      <SearchBar onAddressSelect={handleAddressSelect} />
    </div>
  );
};

export default Propertyhomepage;