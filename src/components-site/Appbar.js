import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useSelector } from 'react-redux';

const ariaLabel = { 'aria-label': 'title' };

const boxStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center'
}

const arrowDisabledStyle = {
  color: '#a3a3a3',
  width: '40px',
  height: '40px',
  margin: '0 5px 0px 10px',
  borderRadius: '10px',
  border: 'solid 2px #f1f9ff',
  backgroundColor: '#fafafa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const arrowEnabledStyle = {
  color: '#0a1239',
  width: '40px',
  height: '40px',
  margin: '0 5px 0px 10px',
  borderRadius: '10px',
  border: 'solid 2px #f1f9ff',
  backgroundColor: '#fafafa',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer'
}

const discardButtonStyle = {
  width: '153px',
  height: '40px',
  margin: '0 12px 0 18px',
  borderRadius: '10px',
  boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.03)',
  backgroundColor: '#5b5c62',
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
}

const playButtonStyle = {
  width: '120px',
  height: '40px',
  margin: '0 8px 0 12px',
  borderRadius: '10px',
  boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.03)',
  border: 'solid 2px #babbbb',
  backgroundColor: '#e8e9e9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#5b5c62'
}

const generateButtonStyle = {
  width: '216px',
  height: '40px',
  margin: '0 0 0 8px',
  // padding: 14px 52px 14px 55px;
  borderRadius: '10px',
  boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.03)',
  backgroundColor: '#df678c',
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const editTitleStyle = {
  width: '480px',
  height: '48px',
  // margin: '0 304px 0 0'
  // padding: '13px 24px',
  borderRadius: '5px',
  border: 'solid 2px #f9f8fa',
  backgroundColor: '#f9f8fa'
}

const Appbar = ({ handleDrawerToggle, canvasRef, onUndo, onRedo }) => {
  const drawerWidth = useSelector(state => state.navigation.drawerWidth);
  const [isEditTitle, setIsEditTitle] = useState(false);

  const cannotUndo = canvasRef && !canvasRef.handler?.transactionHandler.undos.length;
  const cannotRedo = canvasRef && !canvasRef.handler?.transactionHandler.redos.length;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: '#fff',
        boxShadow: '2px 2px 10px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ ...boxStyle }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: '#5b5c62' }} />
          {!isEditTitle && <Typography sx={{ mx: '10px', color: '#5b5c62' }} onClick={() => setIsEditTitle(true)}>Add title here</Typography>}
          {isEditTitle && <Input sx={{ mx: '10px' }} placeholder="Add title here" inputProps={ariaLabel} /*sx={{ ...editTitleStyle }}*/ />}
          {!isEditTitle && <EditIcon fontSize="small" sx={{ color: '#5b5c62' }} onClick={() => setIsEditTitle(true)} />}
        </Box>
        <Box sx={{ ...boxStyle }}>
          <Button onClick={() => console.log(canvasRef.handler.getActiveObject())}>Test</Button>
          <Box sx={cannotUndo ? { ...arrowDisabledStyle } : { ...arrowEnabledStyle }} onClick={cannotUndo ? null : () => onUndo()}><KeyboardArrowLeftIcon /></Box>
          <Box sx={cannotRedo ? { ...arrowDisabledStyle } : { ...arrowEnabledStyle }} onClick={cannotRedo ? null : () => onRedo()}><KeyboardArrowRightIcon /></Box>
          <Box sx={{ ...discardButtonStyle }}>Discard draft</Box>
          <Box sx={{ ...playButtonStyle }}>
            <PlayArrowIcon sx={{ mr: '5px' }} />
            Play
          </Box>
          <Box sx={{ ...generateButtonStyle }}>Generate video</Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;