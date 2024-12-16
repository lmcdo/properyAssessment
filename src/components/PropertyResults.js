import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Link } from '@mui/material';
import PDFGenerator from './PDFGenerator';
import copyToClipboard from 'copy-to-clipboard';
import { Buffer } from 'buffer';

const lgaEpiUrls = {
  'SYDNEY': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2012-0628',
  'INNER WEST': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2022-0457',
  'BAYSIDE': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2021-0498',
  'BLACKTOWN': 'https://legislation.nsw.gov.au/view/html/inforce/2023-12-14/epi-2015-0239',
  'BURWOOD': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2012-0550',
  'CANADA BAY': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2013-0389',
  'BLUE MOUNTAINS': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2015-0829',
  'CAMPBELLTOWN': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2015-0754',
  'CANTERBURY-BANKSTOWN': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2023-0336',
  'HAWKESBURY': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2023-0336',
  'CUMBERLAND': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2021-0651',
  'FAIRFIELD': 'https://legislation.nsw.gov.au/view/html/inforce/current/epi-2013-021'
};

const getEpiUrl = (data) => {
  const zoning = data.find(item => item.layerName === "Land Zoning Map")?.results[0];
  const lgaName = zoning ? zoning["LGA Name"].toUpperCase() : null;

  const epiUrl = lgaName ? lgaEpiUrls[lgaName] : null;

  if (epiUrl) {
    return epiUrl;
  } else {
    console.log("Unable to find EPI URL for the given LGA");
    return "https://legislation.nsw.gov.au/";
  }
};

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

  // Initialize variables with default values
  let zoning = null;
  let height = null;
  let fsr = null;
  let dcpResults = null;

    // Check if data is an array
    if (Array.isArray(data)) {
        // Find the available data from the array
        zoning = data.find(item => item.layerName === "Land Zoning Map")?.results[0];
        height = data.find(item => item.layerName === "Height of Buildings Map")?.results[0];
        const fsrData = data.find(item => item.layerName === "Floor Space Ratio Map")?.results;
        fsr = fsrData && fsrData.length > 0 ? fsrData[0] : null;
        dcpResults = data.find(item => item.layerName === "Development Control Plan")?.results?.[0];
    } else {
        // Handle the case where data is an object
        zoning = data["Land Zoning Map"]?.results?.[0];
        height = data["Height of Buildings Map"]?.results?.[0];
        const fsrData = data["Floor Space Ratio Map"]?.results;
        fsr = fsrData && fsrData.length > 0 ? fsrData[0] : null;
        dcpResults = data["Development Control Plan"]?.results?.[0];
    }

  const lepUrl = getEpiUrl(data);

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
                    Floor Space Ratio
                  </Typography>
                  <Typography>
                    {fsr["Floor Space Ratio"]}
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

        {/* Additional Data Sections */}
        {data.map((item, index) => {
          const { layerName, results } = item;
          if (results && results.length > 0 && layerName !== "Land Zoning Map" && layerName !== "Height of Buildings Map" && layerName !== "Floor Space Ratio Map") {
            return (
              <Grid item xs={12} key={index}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" color="primary">{layerName}</Typography>
                  <Grid container spacing={2}>
                    {results.map((result, resultIndex) => (
                      <Grid item xs={12} md={4} key={resultIndex}>
                        <Typography variant="subtitle1" fontWeight="bold">{result.title}</Typography>
                        {Object.entries(result).map(([key, value]) => (
                          key === "Regional Plan Website" ? (
                            <Typography variant="body2" color="textSecondary" key={key}>
                              Site Link:{' '}
                              <Link href={value.match(/href="(.*?)"/)?.[1] || ''} target="_blank" rel="noopener noreferrer">
                                {value.match(/>(.*?)</)?.[1] || ''}
                              </Link>
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="textSecondary" key={key}>
                              {key}: {value}
                            </Typography>
                          )
                        ))}
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
    </Box>
  );
};

export default PropertyResults;