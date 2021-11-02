import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import EditorView from './editor/EditorView';

const theme = createTheme({
  typography: {
    fontFamily: 'Omnes',
    fontWeight: '500'
  },
});

export default function Main() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Appbar handleDrawerToggle={() => handleDrawerToggle()} />
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={() => handleDrawerToggle()}/>
        <EditorView />
      </ThemeProvider>
    </Box>
  );
}
