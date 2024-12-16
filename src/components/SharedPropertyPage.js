import React from 'react';
import { useLocation } from 'react-router-dom';
import { Buffer } from 'buffer';

const SharedPropertyPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const encodedData = queryParams.get('details');

  // Decode the Base64-encoded data
  const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');
  const propertyData = JSON.parse(decodedData);

  // Render the property details based on the decoded data
  const renderPropertyDetails = () => {
    if (!propertyData) {
      return <div>No planning controls found for this property</div>;
    }

    return (
      <div>
        <h2>Property Details</h2>
        {Object.entries(propertyData).map(([layerName, layerData]) => (
          <div key={layerName}>
            <h3>{layerName}</h3>
            {layerData.map((item, index) => (
              <div key={`${layerName}-${index}`}>
                {Object.entries(item).map(([key, value]) => (
                  <p key={key}>
                    {key}: {value}
                  </p>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return <div>{renderPropertyDetails()}</div>;
};

export default SharedPropertyPage;
