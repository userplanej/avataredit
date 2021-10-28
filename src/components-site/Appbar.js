import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';

const ariaLabel = { 'aria-label': 'title' };

const Appbar = ({ drawerWidth, handleDrawerToggle }) => {
  const [isEditTitle, setIsEditTitle] = useState(false);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: '#7b5da6'
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowBackIosNewIcon fontSize="small" />
          {!isEditTitle && <Typography sx={{ mx: '10px' }} onClick={() => setIsEditTitle(true)}>Add title here</Typography>}
          {isEditTitle && <Input sx={{ mx: '10px' }} placeholder="Add title here" inputProps={ariaLabel} />}
          {!isEditTitle && <BorderColorIcon fontSize="small" onClick={() => setIsEditTitle(true)} />}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;