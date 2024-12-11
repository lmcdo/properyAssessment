import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import theme from './theme';

function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header user={user} onUserChange={setUser} />
        <SearchSection />
      </div>
    </ThemeProvider>
  );
}

export default App;
