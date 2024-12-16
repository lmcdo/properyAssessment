import React from 'react';
import { Box, Button } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFGenerator = ({ propertyData }) => {
  const handleGeneratePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define the table data
    const tableData = Object.entries(propertyData).map(([key, value]) => [key, JSON.stringify(value)]);

    // Add the table to the PDF
    doc.autoTable({
      head: [['Property Data', 'Value']],
      body: tableData,
      startY: 20,
    });

    // Save the PDF file
    doc.save('property_data.pdf');
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleGeneratePDF}>
        Generate PDF
      </Button>
    </Box>
  );
};

export default PDFGenerator;