import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';

import { setPathName } from '../redux/navigation/navigationSlice';
import { setShowBackdrop } from '../redux/backdrop/backdropSlice';
import { setDialogAlertOpen, setDialogAlertTitle, setDialogAlertMessage, setDialogAlertButtonText } from '../redux/dialog-alert/dialogAlertSlice';
import { setReloadUser, setCanSave } from '../redux/user/userSlice';

import CustomInput from './inputs/CustomInput';
import { postImageClip } from '../api/image/clip';
import { getImagePackage, postImagePackage, updateImagePackage } from '../api/image/package';
import { updateUser } from '../api/user/user';
import { pathnameEnum } from './constants/Pathname';
import { drawerWidth } from './constants/Drawer';

const boxStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center'
}

const Appbar = ({ handleDrawerToggle, canvasRef, openGenerateVideo, openDiscardDraft }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pathName = useSelector(state => state.navigation.pathName);
  const canSaveUser = useSelector(state => state.user.canSave);
  const userUpdated = useSelector(state => state.user.userUpdated);

  const [title, setTitle] = useState('');
  
  const cannotUndo = canvasRef && !canvasRef.handler?.transactionHandler.undos.length;
  const cannotRedo = canvasRef && !canvasRef.handler?.transactionHandler.redos.length;

  useEffect(() => {
    const pathname = history.location.pathname;
    dispatch(setPathName(pathname));

    if (pathname === pathnameEnum.editor) {
      const id = history.location.state?.id;
      getImagePackage(id).then(res => setTitle(res.data.body.package_name));
    }
  }, []);

  const createNewVideo = async () => {
    dispatch(setShowBackdrop(true));

    const user = JSON.parse(sessionStorage.getItem('user'));
    const imagePackage = {
      user_id: user.user_id,
      package_name: 'New video',
      is_draft: true
    }
    const imageClip = {
      package_id: null,
      background_type: null,
    }

    await postImagePackage(imagePackage).then((res) => {
      const packageId = res.data.body.package_id;
      imageClip.package_id = packageId;
    });

    await postImageClip(imageClip).then(() => {
      dispatch(setShowBackdrop(false));
      history.push(pathnameEnum.editor, { id: imageClip.package_id });
    });
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const saveTitle = () => {
    if (title !== '') {
      const id = history.location.state?.id;
      updateImagePackage(id, { package_name: title });
    }
  }

  const onUndo = () => {
    canvasRef.handler?.transactionHandler.undo();
  }
  
  const onRedo = () => {
    canvasRef.handler?.transactionHandler.redo();
  }

  const saveUser = async () => {
    // Show backdrop
    dispatch(setShowBackdrop(true));
    // Update user info
    await updateUser(userUpdated.userId, userUpdated).then((res) => {
      updateSessionUser();
      // Show dialog success
      dispatch(setDialogAlertTitle('Change account information'));
      dispatch(setDialogAlertMessage('Account information changed successfully'));
      dispatch(setDialogAlertButtonText('Done'));
      dispatch(setDialogAlertOpen(true));
      // Tell components to update user info displayed
      dispatch(setReloadUser(true));
      dispatch(setCanSave(false));
      // Hide backdrop
      dispatch(setShowBackdrop(false));
    });
  }

  const updateSessionUser = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    user.email = userUpdated.email;
    user.name = userUpdated.name;
    user.bio = userUpdated.bio;
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  const cancelUserChanges = () => {
    dispatch(setReloadUser(true));
  }

  const handleBackToVideos = () => {
    history.push(pathnameEnum.videos);
  }

  const playVideo = () => {
    const objects = canvasRef.handler.exportJSON();
    console.log(objects);
  }

  const isEditorPage = () => {
    return pathName === pathnameEnum.editor;
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${isEditorPage() ? '0' : drawerWidth}px)`, xl: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${isEditorPage() ? '0' : drawerWidth}px`, xl: `${drawerWidth}px` },
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
            sx={{ mr: 2, color: '#fff', display: { lg: isEditorPage() ? 'block' : 'none', xl: 'none' } }}
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
            <ClickAwayListener onClickAway={() => saveTitle()}>
              <Box>
                <CustomInput 
                  value={title}
                  placeholder="Add title here"
                  onChange={handleChangeTitle}
                  startAdornment={<InputAdornment position="start"><ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff" }} onClick={handleBackToVideos} /></InputAdornment>}
                  sx={{ backgroundColor: '#3c4045' }}
                />
              </Box>
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
            disabled={cannotUndo}
            sx={{ minWidth: '0px', p: 1.5, backgroundColor: '#3c4045', border: 'none', mr: 1, '& .MuiButton-startIcon': { m: 0, color: cannotUndo ? '#3c4045' : '#fff' } }} 
            onClick={() => onUndo()}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            disabled={cannotRedo}
            startIcon={<KeyboardArrowRightIcon />} 
            sx={{ minWidth: '0px', p: 1.5, backgroundColor: '#3c4045', border: 'none', '& .MuiButton-startIcon': { m: 0, color: cannotRedo ? '#3c4045' : '#fff' } }} 
            onClick={() => onRedo()}
          />
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ maxWidth: '100%', px: 2, mx: 2, backgroundColor: '#3c4045', border: 'none' }}
            onClick={openDiscardDraft}
          >
            Discard draft
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ px: 7, mr: 2, backgroundColor: '#3c4045', border: 'none' }}
            onClick={playVideo}
          >
            Play
          </Button>
          <Button variant="contained" sx={{ px: 5 }} onClick={openGenerateVideo}>Generate video</Button>
        </Box>}

        {pathName === pathnameEnum.avatars &&
        <Box sx={boxStyle}>
          <Button variant="contained">Request your own avatar</Button>
        </Box>}

        {pathName === pathnameEnum.account &&
        <Box sx={boxStyle}>
          <Button variant="contained" onClick={cancelUserChanges} disabled={!canSaveUser} color="secondary" sx={{ mr: 2, px: 7 }}>Cancel</Button>
          <Button variant="contained" onClick={saveUser} disabled={!canSaveUser} sx={{ px: 8 }}>Save</Button>
        </Box>}
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;