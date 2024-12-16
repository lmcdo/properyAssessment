import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const PropertyResults = ({ data, coordinates }) => {
    console.log('Full PropertyResults data:', data);
    const [streetViewImage, setStreetViewImage] = useState(null);
    const [satelliteImage, setSatelliteImage] = useState(null);

    useEffect(() => {
        if (coordinates) {
            const { lat, lng } = coordinates;
            
            // Street View Image
            const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
            setStreetViewImage(streetViewUrl);

            // Satellite Image
            const satelliteUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=19&size=600x300&maptype=satellite&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
            setSatelliteImage(satelliteUrl);
        }
    }, [coordinates]);

    if (!data) return null;

    // Find the available data
    const zoning = data.find(item => item.layerName === "Land Zoning Map")?.results[0];
    const height = data.find(item => item.layerName === "Height of Buildings Map")?.results[0];
    const fsr = data.find(item => item.layerName === "Floor Space Ratio Map")?.results?.[1];
    const dcpResults = data.find(item => item.layerName === "Development Control Plan")?.results?.[0];

    // Dynamically find LEP URL if available
    const lepUrl = zoning && zoning["EPI Name"] 
        ? `https://legislation.nsw.gov.au/view/html/inforce/${zoning['Commenced Date'].replace(/\-/g, '')}/epi-${zoning['EPI Name'].match(/\d{4}-\d+/)?.[0]}`
        : "https://legislation.nsw.gov.au/";

    // If no data found, show message
    if (!zoning && !height && !fsr && !dcpResults) {
        return (
            <Box sx={{ mt: 2, p: 2 }}>
                <Typography>No planning controls found for this property</Typography>
            </Box>
        );
    }
    
    return (
        <Box sx={{ mt: 2, p: 2 }}>
            {/* Property Images Section */}
            {(streetViewImage || satelliteImage) && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    {streetViewImage && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 1 }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Street View
                                </Typography>
                                <img 
                                    src={streetViewImage} 
                                    alt="Street View" 
                                    style={{ width: '100%', height: 'auto' }} 
                                />
                            </Paper>
                        </Grid>
                    )}
                    {satelliteImage && (
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 1 }}>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Satellite View
                                </Typography>
                                <img 
                                    src={satelliteImage} 
                                    alt="Satellite View" 
                                    style={{ width: '100%', height: 'auto' }} 
                                />
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Existing Property Details */}
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
                                        <a 
                                            href={lepUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {zoning["EPI Name"]}
                                        </a>
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

                {dcpResults && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" color="primary" gutterBottom>Development Control Plans</Typography>
                            <Typography>
                                <a 
                                    href={dcpResults.planURL} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {dcpResults.planName}
                                </a>
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default PropertyResults;