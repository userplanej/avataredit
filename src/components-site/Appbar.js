import React, { useState } from 'react';
import { useSelector } from 'react-redux';

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
import ClickAwayListener from '@mui/material/ClickAwayListener';

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

const mainButtonStyle = {
  width: '216px',
  height: '40px',
  margin: '0 0 0 8px',
  borderRadius: '10px',
  boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.03)',
  backgroundColor: '#df678c',
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}

const secondaryButtonStyle = {
  width: '216px',
  height: '40px',
  margin: '0 0 0 8px',
  borderRadius: '10px',
  boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.03)',
  border: 'solid 2px #babbbb',
  backgroundColor: '#fff',
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#5b5c62'
}

const Appbar = ({ handleDrawerToggle, canvasRef, onUndo, onRedo }) => {
  const pathName = useSelector(state => state.navigation.pathName);
  const drawerWidth = useSelector(state => state.navigation.drawerWidth);
  const [title, setTitle] = useState('');

  const cannotUndo = canvasRef && !canvasRef.handler?.transactionHandler.undos.length;
  const cannotRedo = canvasRef && !canvasRef.handler?.transactionHandler.redos.length;

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const saveTitle = () => {
  }

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
        <Box sx={boxStyle}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {pathName === '/home' &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create new video</Typography>
          </Box>}

          {pathName === '/videos' &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>All videos</Typography>
          </Box>}

          {pathName === '/editor' &&
          <Box sx={boxStyle}>
            <ArrowBackIosNewIcon fontSize="small" sx={{ color: '#5b5c62' }} />
            <ClickAwayListener onClickAway={() => saveTitle(false)}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#5b5c62' }}>
                <input 
                  placeholder="Add title here"
                  className="add-title-input"
                  onChange={handleChangeTitle}
                />
                <EditIcon fontSize="small" sx={{ position: 'relative', right: '30px' }} />
              </Box>
            </ClickAwayListener>
          </Box>}

          {pathName === '/avatars' &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Avatars</Typography>
          </Box>}
        </Box>

        {pathName === '/home' &&
        <Box sx={boxStyle}>
          <Box sx={secondaryButtonStyle}>Import powerpoint</Box>
          <Box sx={mainButtonStyle}>Create new video</Box>
        </Box>}

        {pathName === '/videos' &&
        <Box sx={boxStyle}>
          <Box sx={mainButtonStyle}>Create new video</Box>
        </Box>}

        {pathName === '/editor' && 
        <Box sx={boxStyle}>
          {/* <Button onClick={() => console.log(canvasRef.handler.getActiveObject())}>Test</Button> */}
          <Box sx={cannotUndo ? arrowDisabledStyle : arrowEnabledStyle} onClick={cannotUndo ? null : () => onUndo()}><KeyboardArrowLeftIcon /></Box>
          <Box sx={cannotRedo ? arrowDisabledStyle : arrowEnabledStyle} onClick={cannotRedo ? null : () => onRedo()}><KeyboardArrowRightIcon /></Box>
          <Box sx={discardButtonStyle}>Discard draft</Box>
          <Box sx={playButtonStyle}>
            <PlayArrowIcon sx={{ mr: '5px' }} />
            Play
          </Box>
          <Box sx={mainButtonStyle}>Generate video</Box>
        </Box>}

        {pathName === '/avatars' &&
        <Box sx={boxStyle}>
          <Box sx={mainButtonStyle}>Request your own avatar</Box>
        </Box>}
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;