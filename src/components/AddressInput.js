import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AddressInput = ({ isEditable = true, label = 'Address', address: addressProp, onAddressSelect }) => {
  const handleGetInfo = async () => {
    try {
      // Call the webhook with the address
      const response = await fetch('/your-webhook-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: addressProp }),
      });

      // Handle the webhook response
      const data = await response.json();
      console.log('Webhook response:', data);
    } catch (error) {
      console.error('Error calling webhook:', error);
    }
  };

  const handleAddressSelect = () => {
    onAddressSelect(addressProp);
  };

  return (
    <Box display="flex" alignItems="center">
      <TextField
        label={label}
        variant="outlined"
        value={addressProp}
        InputProps={{
          readOnly: !isEditable,
          style: { width: '400px' }, // Increase the width of the TextField

        }}
      />
      <IconButton onClick={handleAddressSelect} color="primary" aria-label="Select Address">
        <InfoIcon />
      </IconButton>
      <IconButton onClick={handleGetInfo} color="primary" aria-label="Get Info">
        <InfoIcon />
      </IconButton>
    </Box>
  );
};

export default AddressInput;
