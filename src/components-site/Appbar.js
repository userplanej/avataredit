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
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';

import { setPathName } from '../redux/navigation/navigationSlice';

import CustomInput from './inputs/CustomInput';
import { postImagePackage } from '../api/image/package';
import { pathnameEnum } from './constants/Pathname';
import { drawerWidth } from './constants/Drawer';

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

const Appbar = ({ handleDrawerToggle, canvasRef }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pathName = useSelector(state => state.navigation.pathName);
  const [title, setTitle] = useState('');
  
  const cannotUndo = canvasRef && !canvasRef.handler?.transactionHandler.undos.length;
  const cannotRedo = canvasRef && !canvasRef.handler?.transactionHandler.redos.length;

  useEffect(() => {
    const pathname = history.location.pathname;
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
        backgroundColor: '#24282c',
        boxShadow: '2px 2px 10px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left part */}
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
            <Typography variant="h5" sx={{ color: '#fff' }}>Create new video</Typography>
          </Box>}

          {pathName === pathnameEnum.videos &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ color: '#fff' }}>All videos</Typography>
          </Box>}

          {pathName === pathnameEnum.editor &&
          <Box sx={boxStyle}>
            <ClickAwayListener onClickAway={() => saveTitle(false)}>
              <CustomInput 
                placeholder="Add title here"
                onChange={handleChangeTitle}
                startAdornment={<InputAdornment position="start"><ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff" }} /></InputAdornment>}
                sx={{ backgroundColor: '#3c4045' }}
              />
            </ClickAwayListener>
          </Box>}

          {pathName === pathnameEnum.avatars &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ color: '#fff' }}>Avatars</Typography>
          </Box>}

          {pathName === pathnameEnum.account &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ color: '#fff' }}>Account Settings</Typography>
          </Box>}
        </Box>

        {/* Right part */}
        {pathName === pathnameEnum.home &&
        <Box sx={boxStyle}>
          <Button variant="contained" color="secondary" sx={{ maxWidth: '100%', mr: 1, color: '#fff' }}>Import powerpoint</Button>
          <Button variant="contained" onClick={createNewVideo}>Create new video</Button>
        </Box>}

        {pathName === pathnameEnum.videos &&
        <Box sx={boxStyle}>
          <Button variant="contained" onClick={createNewVideo}>Create new video</Button>
        </Box>}

        {pathName === pathnameEnum.editor && 
        <Box sx={boxStyle}>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<KeyboardArrowLeftIcon />} 
            sx={{ minWidth: '0px', p: 1.5, backgroundColor: '#3c4045', border: 'none', mr: 1, color: cannotUndo ? '' : '#fff', '& .MuiButton-startIcon': { m: 0 } }} 
            onClick={cannotUndo ? null : () => onUndo()}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<KeyboardArrowRightIcon />} 
            sx={{ minWidth: '0px', p: 1.5, backgroundColor: '#3c4045', border: 'none', color: cannotRedo ? '' : '#fff', '& .MuiButton-startIcon': { m: 0 } }} 
            onClick={cannotRedo ? null : () => onRedo()}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ maxWidth: '100%', px: 2, mx: 2, backgroundColor: '#3c4045', border: 'none' }}
          >
            Discard draft
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ px: 7, mr: 2, backgroundColor: '#3c4045', border: 'none' }}
          >
            Play
          </Button>
          <Button variant="contained" sx={{ px: 5 }}>Generate video</Button>
        </Box>}

        {pathName === pathnameEnum.avatars &&
        <Box sx={boxStyle}>
          <Button variant="contained" onclick={createNewVideo}>Request your own avatar</Button>
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