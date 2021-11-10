import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
import InputAdornment from '@mui/material/InputAdornment';

import { setDrawerWidth, setIsMinimal, setPathName } from '../redux/navigation/navigationSlice';
import { drawerMaxWidth, drawerMinWidth } from './constants/Drawer';

import CustomInput from './inputs/CustomInput';
import { postImagePackage } from '../api/image/package';
import { pathnameEnum } from './constants/Pathname';

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

const Appbar = ({ handleDrawerToggle, canvasRef }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pathName = useSelector(state => state.navigation.pathName);
  const drawerWidth = useSelector(state => state.navigation.drawerWidth);
  const [title, setTitle] = useState('');
  
  const cannotUndo = canvasRef && !canvasRef.handler?.transactionHandler.undos.length;
  const cannotRedo = canvasRef && !canvasRef.handler?.transactionHandler.redos.length;

  useEffect(() => {
    const pathname = history.location.pathname;
    if (pathname === pathnameEnum.editor) {
      dispatch(setIsMinimal(true));
      dispatch(setDrawerWidth(drawerMinWidth));
    } else {
      dispatch(setIsMinimal(false));
      dispatch(setDrawerWidth(drawerMaxWidth));
    }
    dispatch(setPathName(pathname));
  }, []);

  const createNewVideo = () => {
    
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const saveTitle = (value) => {
    console.log(value);
  }

  const onUndo = () => {
    canvasRef.handler?.transactionHandler.undo();
  }
  
  const onRedo = () => {
    canvasRef.handler?.transactionHandler.redo();
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
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
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {pathName === pathnameEnum.home &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Create new video</Typography>
          </Box>}

          {pathName === pathnameEnum.videos &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>All videos</Typography>
          </Box>}

          {pathName === pathnameEnum.editor &&
          <Box sx={boxStyle}>
            <ClickAwayListener onClickAway={() => saveTitle(false)}>
              <CustomInput 
                placeholder="Add title here"
                onChange={handleChangeTitle}
                startAdornment={<InputAdornment position="start"><ArrowBackIosNewIcon fontSize="small" /></InputAdornment>}
                endAdornment={<InputAdornment position="end"><EditIcon fontSize="small" /></InputAdornment>}
                sx={{ width: '400px' }}
              />
            </ClickAwayListener>
          </Box>}

          {pathName === pathnameEnum.avatars &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Avatars</Typography>
          </Box>}

          {pathName === pathnameEnum.account &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Account Settings</Typography>
          </Box>}
        </Box>

        {pathName === pathnameEnum.home &&
        <Box sx={boxStyle}>
          <Box sx={secondaryButtonStyle}>Import powerpoint</Box>
          <Box sx={mainButtonStyle} onclick={createNewVideo}>Create new video</Box>
        </Box>}

        {pathName === pathnameEnum.videos &&
        <Box sx={boxStyle} onclick={createNewVideo}>
          <Box sx={mainButtonStyle}>Create new video</Box>
        </Box>}

        {pathName === pathnameEnum.editor && 
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

        {pathName === pathnameEnum.avatars &&
        <Box sx={boxStyle}>
          <Box sx={mainButtonStyle}>Request your own avatar</Box>
        </Box>}

        {pathName === pathnameEnum.account &&
        <Box sx={boxStyle}>
          <Button variant="contained" color="secondary" sx={{ mr: 2, px: 7 }}>Cancel</Button>
          <Button variant="contained" sx={{ px: 8 }}>Save</Button>
        </Box>}
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;