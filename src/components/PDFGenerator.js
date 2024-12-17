import React, { useRef, useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import jsPDF from 'jspdf';
import { Box, Button, Snackbar } from '@mui/material';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
  },
});

const PDFGenerator = ({ propertyData }) => {
  const pdfRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const generatePDF = () => {
    setIsGeneratingPDF(true);

    try {
      const doc = new jsPDF();
      doc.text('Property Details', 10, 10);

      // Add property details to the PDF
      let y = 20;
      Object.entries(propertyData).forEach(([key, value]) => {
        doc.setFontSize(12);
        doc.text(`${key}: ${value}`, 10, y);
        y += 5;
      });

      doc.save('property_details.pdf');
      setSnackbarMessage('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbarMessage('Error generating PDF');
    } finally {
      setIsGeneratingPDF(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={generatePDF}
        disabled={isGeneratingPDF}
      >
        {isGeneratingPDF ? 'Generating PDF...' : 'Save as PDF'}
      </Button>
      <Document ref={pdfRef}>
        <Page size="A4" style={styles.container}>
          <View style={styles.section}>
            <Text style={styles.title}>Property Details</Text>
            {Object.entries(propertyData).map(([key, value]) => (
              <View key={key}>
                <Text style={styles.text}>{`${key}: ${value}`}</Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default PDFGenerator;