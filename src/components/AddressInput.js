import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const AddressInput = ({ isEditable = true, label = 'Address', address: addressProp, onAddressSelect }) => {
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
                    style: { width: '400px' },
                }}
            />
      
        </Box>
    );
};

export default AddressInput;