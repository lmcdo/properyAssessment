import React, { useState, useEffect } from 'react';
import { Box, Button, Collapse } from '@mui/material';
import HeaderCard from './HeaderCard';
import ResultTable from './ResultTable';

const CollapsibleSection = ({ layer, isExpanded }) => {
  const [open, setOpen] = useState(isExpanded);

  useEffect(() => {
    setOpen(isExpanded);
  }, [isExpanded]);

  return (
    <Box sx={{ mb: 2 }}>
      <Button variant="contained" fullWidth onClick={() => setOpen(!open)} sx={{ textAlign: 'left' }}>
        {layer.layerName}
      </Button>
      <Collapse in={open}>
        <HeaderCard data={layer.results[0]} />
        <ResultTable results={layer.results} />
      </Collapse>
    </Box>
  );
};

export default CollapsibleSection;
