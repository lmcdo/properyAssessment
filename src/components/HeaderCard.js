import React from 'react';
import { Box, Typography } from '@mui/material';

const HeaderCard = ({ data }) => (
  <Box sx={{ backgroundColor: '#e3f2fd', p: 2, borderRadius: 2, mb: 1 }}>
    <Typography variant="body1" fontWeight="bold">{data.title || "Details"}</Typography>
    <Typography variant="body2">Commenced Date: {data["Commenced Date"] || "N/A"}</Typography>
    <Typography variant="body2">Currency Date: {data["Currency Date"] || "N/A"}</Typography>
  </Box>
);

export default HeaderCard;
