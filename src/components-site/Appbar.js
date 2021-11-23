import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

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
import InputAdornment from '@mui/material/InputAdornment';

import { setPathName } from '../redux/navigation/navigationSlice';
import { setShowBackdrop } from '../redux/backdrop/backdropSlice';
import { setDialogAlertOpen, setDialogAlertTitle, setDialogAlertMessage, setDialogAlertButtonText } from '../redux/dialog-alert/dialogAlertSlice';
import { setReloadUser, setCanSave } from '../redux/user/userSlice';

import CustomInput from './inputs/CustomInput';
import { postImageClip } from '../api/image/clip';
import { postImagePackage, updateImagePackage } from '../api/image/package';
import { updateUser } from '../api/user/user';
import { pathnameEnum } from './constants/Pathname';
import { drawerWidth } from './constants/Drawer';

const boxStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center'
}

const Appbar = (props) => {
  const {
    /**
     * Toggle drawer when screen has a small size
     */
    handleDrawerToggle, 
    /**
     * Canvas reference
     */
    canvasRef, 
    /**
     * Open generate video dialog
     */
    openGenerateVideo, 
    /**
     * Open discard draft dialog
     */
    openDiscardDraft,
    /**
     * Open video preview dialog
     */
    openVideoPreview,
    /**
     * Change the preview video source
     */
    changeVideoSource
  } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const pathName = useSelector(state => state.navigation.pathName);
  const canSaveUser = useSelector(state => state.user.canSave);
  const userUpdated = useSelector(state => state.user.userUpdated);
  const video = useSelector(state => state.video.video);

  const [title, setTitle] = useState('');
  const [titleSaved, setTitleSaved] = useState('');
  
  const cannotUndo = canvasRef && !canvasRef.handler?.transactionHandler.undos.length;
  const cannotRedo = canvasRef && !canvasRef.handler?.transactionHandler.redos.length;

  useEffect(() => {
    const pathname = history.location.pathname;
    dispatch(setPathName(pathname));

    if (pathname === pathnameEnum.editor) {
      setTitle(video.package_name);
      setTitleSaved(video.package_name);
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

    let packageId = null;
    await postImagePackage(imagePackage).then((res) => {
      packageId = res.data.body.package_id;
      imageClip.package_id = packageId;
    });

    let clipId = null;
    await postImageClip(imageClip).then((res) => {
      clipId = res.data.body.clip_id;
    });

    // Update image package current clip_id
    await updateImagePackage(packageId, { clip_id: clipId }).then(() => {
      dispatch(setShowBackdrop(false));
      history.push(pathnameEnum.editor, { id: packageId });
    });
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const saveTitle = () => {
    if (title !== '' && title !== titleSaved) {
      const id = history.location.state?.id;
      updateImagePackage(id, { package_name: title }).then(() => setTitleSaved(title));
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

  const handleBackToAccount = () => {
    history.push(pathnameEnum.account);
  }

  const playVideo = () => {
    dispatch(setShowBackdrop(true));
    // const canvasObjects = canvasRef.handler.getObjects();

    // let file = await fetch('https://upload.wikimedia.org/wikipedia/commons/9/91/Checked_icon.png').then(r => r.blob()).then(blobFile => new File([blobFile], "test", { type: "image/png" }));

    const canvasBlob = canvasRef.handler?.getCanvasImageAsBlob();
    const file = new File([canvasBlob], "test", { type: "image/png" });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('lifecycleName', 'Studio_Main_Action_Lifecycle');
    formData.append('catalogInstanceName', 'Studio_Main_Action_Catalog');
    formData.append('target', 'SoftwareCatalogInstance');
    formData.append('async', false);

    let payload = {
      text: 'Hello, this is a test',
      width: '1280',
      height: '720',
      speaker: '0',
      background: '',
      action: '1'
      // apiId: 'ryu',
      // apiKey: 'd0cad9547b9c4a65a5cdfe50072b1588',
      // objects: []
    };

    // let objects = [];
    // canvasObjects.map(object => {
    //   objects.push(object.toObject());
    // });
    // payload.objects.push({ objects });

    formData.append('payload', payload);

    const url = 'http://serengeti.maum.ai/api.app/app/v2/handle/catalog/instance/lifecycle/executes';
    const headers = {
      AccessKey: 'SerengetiAdministrationAccessKey',
      SecretKey: 'SerengetiAdministrationSecretKey',
      LoginId: 'maum-orchestra-com'
    }

    axios({
      method: 'post',
      url: url, 
      data: formData,
      headers: headers,
      responseType: 'blob'
    }).then((res) => {
      dispatch(setShowBackdrop(false));
      const url = URL.createObjectURL(new Blob([res.data]));
      changeVideoSource(url);
      openVideoPreview();
    });
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
          <CustomInput 
            value={title}
            onChange={handleChangeTitle}
            onBlur={saveTitle}
            startAdornment={<InputAdornment position="start"><ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff" }} onClick={handleBackToVideos} /></InputAdornment>}
            sx={{ backgroundColor: '#3c4045' }}
          />
          }

          {pathName === pathnameEnum.avatars &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ color: '#fff' }}>Avatars</Typography>
          </Box>}

          {pathName === pathnameEnum.account &&
          <Box sx={boxStyle}>
            <Typography variant="h5" sx={{ color: '#fff' }}>Account Settings</Typography>
          </Box>}

          {pathName === pathnameEnum.billing &&
          <Box sx={boxStyle}>
            <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff", mr: 2 }} onClick={handleBackToAccount} />
            <Typography variant="h5" sx={{ color: '#fff' }}>Billing information</Typography>
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