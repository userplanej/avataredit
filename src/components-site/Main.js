import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Appbar from './Appbar';
import Sidebar from './Sidebar';
import EditorView from './editor/EditorView';

const drawerMaxWidth = 264;
const drawerMinWidth = 80;

export default function Main() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMinimal, setIsMinimal] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      <Appbar drawerWidth={isMinimal ? drawerMinWidth : drawerMaxWidth} handleDrawerToggle={() => handleDrawerToggle()} />
      <Sidebar isMinimal={isMinimal} drawerWidth={isMinimal ? drawerMinWidth : drawerMaxWidth} mobileOpen={mobileOpen} handleDrawerToggle={() => handleDrawerToggle()}/>
      <EditorView />
    </Box>
  );
}
