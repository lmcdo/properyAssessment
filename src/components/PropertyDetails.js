import React from 'react';
import { useLocation } from 'react-router-dom';

const PropertyDetails = () => {
  const location = useLocation();
  const webhookData = location.state?.webhookData || {};

  return (
    <div>
      <h2>Property Details</h2>
      <pre>{JSON.stringify(webhookData, null, 2)}</pre>
    </div>
  );
};

export default PropertyDetails;
