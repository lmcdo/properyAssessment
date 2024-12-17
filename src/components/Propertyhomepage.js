import React, { useState } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Box, Button } from '@mui/material';
import SearchBar from './Searchbar';
import AddressInput from './AddressInput';
import LoadingIndicator from './LoadingIndicator';
import PropertyResults  from './PropertyResults';
import { getPropertyDetails } from '../services/propertyService';
import Header from './Header';

const Propertyhomepage = () => {
  const [mapCenter, setMapCenter] = useState({ lat: -33.860664, lng: 151.208138 });
  const [mapZoom, setMapZoom] = useState(13);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [propertyData, setPropertyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapStyles = {
    height: '50vh',
    width: '100%',
  };

  const handleAddressSelect = ({ address, lat, lng }) => {
    setSelectedAddress(address);
    setMapCenter({ lat, lng });
    setMapZoom(18);
  };

  const handleGetProperty = async () => {
    if (selectedAddress) {
      console.log('Getting property for address:', selectedAddress);
      console.log('Current map center:', mapCenter);
      
      setIsLoading(true);
      setPropertyData(null);

      try {
        const data = await getPropertyDetails(selectedAddress);
        console.log('Property details received:', data);
        setPropertyData(data);
      } catch (error) {
        console.error('Error fetching property details:', error);
        // Add error handling UI if needed
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box>
      <Header />
      <Box sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <AddressInput 
            isEditable={false} 
            label="Selected Address" 
            address={selectedAddress} 
            onAddressSelect={handleAddressSelect} 
          />
          <Button 
            variant="contained" 
            onClick={handleGetProperty}
            disabled={!selectedAddress}
          >
            Get Property Details
          </Button>
        </Box>

        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={mapZoom}
          center={mapCenter}
        >
          <Marker position={mapCenter} />
        </GoogleMap>

        {isLoading ? (
          <LoadingIndicator />
        ) : propertyData ? (
          <PropertyResults 
            data={propertyData} 
            coordinates={{ 
              lat: mapCenter.lat, 
              lng: mapCenter.lng 
            }}
            address={selectedAddress}
          />
        ) : null}

        <SearchBar onAddressSelect={handleAddressSelect} />
      </Box>
    </Box>
  );
};

export default Propertyhomepage;