import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';

const SummaryGrid = ({ data }) => {
  const summaries = [
    { label: 'Land Zoning', value: data.find(item => item.layerName === "Land Zoning Map")?.results[0]?.Zone || 'N/A' },
    { label: 'Maximum Building Height', value: data.find(item => item.layerName === "Height of Buildings Map")?.results[0]?.["Maximum Building Height"] || 'N/A' },
    { label: 'Floor Space Ratio', value: data.find(item => item.layerName === "Floor Space Ratio Map")?.results[0]?.["Floor Space Ratio"] || 'N/A' }
  ];

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Key Zoning Summary</Typography>
      <Grid container spacing={2}>
        {summaries.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box sx={{ p: 2, backgroundColor: '#f1f1f1', borderRadius: 2 }}>
              <Typography variant="body1" fontWeight="bold">{item.label}</Typography>
              <Typography variant="body2">{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SummaryGrid;
