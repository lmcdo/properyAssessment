import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Button, Link, Card, CardHeader, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, DialogContentText } from '@mui/material';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SummaryGrid from './SummaryGrid';
import CollapsibleSection from './CollapsibleSection';
import ResultTable from './ResultTable';
import parse from 'html-react-parser';

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


const PropertyResults = ({ data, coordinates, address }) => {
  console.log('Full PropertyResults data:', data);
  const [streetViewImage, setStreetViewImage] = useState(null);
  const [satelliteImage, setSatelliteImage] = useState(null);
  const [lotData, setLotData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const propIdRef = useRef(null);
  const [openSavePDFDialog, setOpenSavePDFDialog] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

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

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (address) {
        fetchLotData();
      }
    }, 500); // Adjust the delay as needed

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [address]);

    const fetchLotData = async () => {
      try {
        // Step 1: Get Property ID
        const searchResponse = await axios.get(
          `https://api.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/address?a=${encodeURIComponent(address)}&noOfRecords=1`
        );

        const searchData = searchResponse.data;

        if (!searchData || searchData.length === 0) {
          throw new Error('No matching property found');
        }

      const propId = searchData[0].propId;
      propIdRef.current = propId;

      // Step 2: Get Lot Data
      console.log('Fetching lot data for propId:', propId);

      const lotResponse = await fetch(
        `https://api.apps1.nsw.gov.au/planning/viewersf/V1/ePlanningApi/lot?propId=${propId}`
      );

      if (!lotResponse.ok) {
        throw new Error(`Failed to fetch lot data: ${lotResponse.status}`);
      }

      const lotData = await lotResponse.json();
      setLotData(lotData);
    } catch (error) {
      console.error('Error fetching lot data:', error);
    }
  };

  const getEpiUrl = (data) => {
    let zoning;

    if (Array.isArray(data)) {
      zoning = data.find(item => item.layerName === "Land Zoning Map")?.results[0];
    } else {
      zoning = data["Land Zoning Map"]?.results?.[0];
    }

    const lgaName = zoning ? zoning["LGA Name"]?.toUpperCase() : null;
    const epiUrl = lgaName && lgaEpiUrls[lgaName] ? lgaEpiUrls[lgaName] : null;

    if (epiUrl) {
      return epiUrl;
    } else {
      console.log("Unable to find EPI URL for the given LGA");
      return "https://legislation.nsw.gov.au/";
    }
  };

  const lepUrl = getEpiUrl(data);

  // Initialize variables with default values
  let zoning = null;
  let height = null;
  let fsr = null;
  let dcpResults = null;

  // Check if data is an array
  if (Array.isArray(data)) {
    console.log('Data is an array');
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

  // If no data found, show message
  if (!zoning && !height && !fsr && !dcpResults) {
    return (
      <Box sx={{ mt: 2, p: 2 }}>
        <Typography>No planning controls found for this property</Typography>
      </Box>
    );
  }

  const parseLotDescription = (lotDescription) => {
    const parts = lotDescription.split('/');
    const lot = parts[0];
    const section = parts[2];
    return { lot, section };
  };

  const getCardBackgroundColor = (index) => {
    return index % 2 === 0 ? '#f5f5f5' : '#ffffff'; // Alternating light gray and white background colors
  };

  const renderResultCards = (results, layerName) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {results.map((result, index) => (
          <Box key={`${layerName}-${index}`} sx={{ width: '100%', p: 1 }}>
            <Card>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                    {result.Zone || result.title}
                  </Typography>
                }
                subheader={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Commenced Date: {result["Commenced Date"]}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Current Date: {currentDate.toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flexGrow: 1 }}>
                  {Object.entries(result).map(([key, value]) => (
                    <Typography variant="body2" color="textSecondary" key={key} sx={{ wordBreak: 'break-word' }}>
                      {key}: {value}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();

    // Define the table data
    const tableData = Object.entries(data).map(([key, value]) => [key, JSON.stringify(value)]);

    // Add the table to the PDF
    doc.autoTable({
      head: [['Property Data', 'Value']],
      body: tableData,
      startY: 20,
    });

    // Get the PDF data as a base64 string
    const pdfData = doc.output('datauristring');

      setPdfData(pdfData);
      setOpenSavePDFDialog(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleExpandAll = () => {
    setExpandAll((prevState) => !prevState);
  };

  const renderRegionalPlanLink = (data) => {
    const regionalPlanData = data.find(item => item.layerName === "Regional Plan Boundary");

    if (regionalPlanData && regionalPlanData.results && regionalPlanData.results.length > 0) {
      const regionalPlanWebsiteHtml = regionalPlanData.results[0]["Regional Plan Website"] || '';
      const decodedHtml = regionalPlanWebsiteHtml.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const regionalPlanName = regionalPlanData.results[0]["title"] || '';

      if (decodedHtml && regionalPlanName) {
        console.log('Decoded HTML:', decodedHtml);
        console.log('Regional Plan Name:', regionalPlanName);

        return (
          <>
            <Typography variant="body1" gutterBottom>
              Regional Plan Website:
            </Typography>
            {parse(decodedHtml)}
          </>
        );
      } else {
        console.log("Unable to find Regional Plan Website data");
      }
    } else {
      console.log("Unable to find Regional Plan Boundary data");
    }

    return null;
  };

  return (
    <Box>
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Property Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            Date: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Address: <strong>{address}</strong>
          </Typography>
          {propIdRef.current && (
            <Typography variant="body1" gutterBottom>
              Property ID: {propIdRef.current}
            </Typography>
          )}
          {lotData && lotData.length > 0 ? (
            <Typography variant="body1" gutterBottom>
              Lot: <strong>{parseLotDescription(lotData[0].attributes.LotDescription).lot}</strong> | Section: <strong>{parseLotDescription(lotData[0].attributes.LotDescription).section}</strong>
            </Typography>
          ) : (
            <Typography variant="body1" gutterBottom>
              Lot and Section data not available
            </Typography>
          )}
          {data && data.length > 0 && (
            <>
              {data[0].results[0]["LGA Name"] && (
                <Typography variant="body1" gutterBottom>
                  LGA: {data[0].results[0]["LGA Name"]}
                </Typography>
              )}
              {data[0].results[0]["EPI Name"] && (
                <Typography variant="body1" gutterBottom>
                  <Link href={getEpiUrl(data)} target="_blank" rel="noopener noreferrer">
                    {data[0].results[0]["EPI Name"]}
                  </Link>
                </Typography>
              )}
            </>
          )}
          {renderRegionalPlanLink(data)}
        </Box>
        <Button variant="contained" color="primary" onClick={generatePDF} disabled={isGeneratingPDF}>
          {isGeneratingPDF ? 'Generating PDF...' : 'Save PDF'}
        </Button>
      </Box>

      {/* Street View and Satellite Images */}
      {streetViewImage && <img src={streetViewImage} alt="Street View" />}
      {satelliteImage && <img src={satelliteImage} alt="Satellite View" />}

      {/* Summary Grid */}
      <SummaryGrid data={data} />

      {/* Expand/Collapse All Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={handleExpandAll}>
          {expandAll ? 'Collapse All' : 'Expand All'}
        </Button>
      </Box>

      {/* Collapsible Sections */}
      {data && data.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {data.map((item) => (
            <Box key={item.layerName} sx={{ width: '100%', p: 1 }}>
              <CollapsibleSection layer={item} isExpanded={expandAll} />
            </Box>
          ))}
        </Box>
      )}

      {/* Save PDF Dialog */}
      <Dialog open={openSavePDFDialog} onClose={() => setOpenSavePDFDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Download Property Report</DialogTitle>
        <DialogContent>
          {isGeneratingPDF ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
            </Box>
          ) : pdfData ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
              <DialogContentText>Click the button below to download the PDF report.</DialogContentText>
              <Box mt={2}>
                <a href={`data:application/pdf;base64,${pdfData}`} download="property_report.pdf">
                  <Button variant="contained" color="primary">
                    Download PDF
                  </Button>
                </a>
              </Box>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <Typography variant="body1" color="error">
                An error occurred while generating the PDF. Please try again.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSavePDFDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertyResults;