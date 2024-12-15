import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const PropertyResults = ({ data }) => {
    if (!data) return null;

    // Log the raw data to see what we're working with
    console.log('Full data:', data);

    const zoning = data.find(item => item.layerName === "Land Zoning Map")?.results[0];
    console.log('Zoning data:', zoning);

    const height = data.find(item => item.layerName === "Height of Buildings Map")?.results[0];
    const fsr = data.find(item => item.layerName === "Floor Space Ratio Map")?.results[1];

    return (
        <Box sx={{ mt: 2, p: 2 }}>
            <Typography variant="h5" gutterBottom>Development Controls</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" color="primary">Key Development Standards</Typography>
                        <Grid container spacing={2}>
                            {zoning && (
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Land Zoning
                                    </Typography>
                                    <Typography>
                                        Zone {zoning.Zone}: {zoning["Land Use"]}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        LEP: {zoning["EPI Name"]}
                                        <br />
                                        Amendment: {zoning.Amendment}
                                        <br />
                                        Commenced: {zoning["Commenced Date"]}
                                        <br />
                                        LGA: {zoning["LGA Name"]}
                                    </Typography>
                                </Grid>
                            )}

                            {height && (
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Maximum Building Height
                                    </Typography>
                                    <Typography>
                                        {height["Maximum Building Height"]} meters
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Under {height["Legislative Clause"]}
                                        <br />
                                        Amendment: {height.Amendment}
                                        <br />
                                        Commenced: {height["Commenced Date"]}
                                    </Typography>
                                </Grid>
                            )}

                            {fsr && (
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Floor Space Ratio (FSR)
                                    </Typography>
                                    <Typography>
                                        Maximum FSR: {fsr["Floor Space Ratio"]}:1
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Under {fsr["Legislative Clause"]}
                                        <br />
                                        Amendment: {fsr.Amendment}
                                        <br />
                                        Commenced: {fsr["Commenced Date"]}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PropertyResults;