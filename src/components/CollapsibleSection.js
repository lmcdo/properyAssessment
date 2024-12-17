import React, { useState } from 'react';
import { Box, Button, Collapse } from '@mui/material';
import HeaderCard from './HeaderCard';
import ResultTable from './ResultTable';

const CollapsibleSection = ({ layer }) => {
  const [open, setOpen] = useState(false);

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
