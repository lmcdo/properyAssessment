import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyResults from './PropertyResults';

const SharedProperty = () => {
  const location = useLocation();
  const [propertyData, setPropertyData] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const encodedPropertyDetails = searchParams.get('details');

      if (encodedPropertyDetails) {
        const decodedPropertyDetails = JSON.parse(atob(encodedPropertyDetails));
        setPropertyData(decodedPropertyDetails);

        // Extract coordinates from the decodedPropertyDetails object
        const { latitude, longitude } = decodedPropertyDetails;
        setCoordinates({ lat: latitude, lng: longitude });
      }
    };

    fetchPropertyDetails();
  }, [location.search]);

  return propertyData && coordinates ? (
    <PropertyResults data={propertyData} coordinates={coordinates} />
  ) : (
    <div>Loading...</div>
  );
};

export default SharedProperty;