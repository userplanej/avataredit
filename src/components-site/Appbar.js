import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

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

import CustomInput from './inputs/CustomInput';

import { setPathName } from '../redux/navigation/navigationSlice';
import { setShowBackdrop } from '../redux/backdrop/backdropSlice';
import { setDialogAlertOpen, setDialogAlertTitle, setDialogAlertMessage, setDialogAlertButtonText } from '../redux/dialog-alert/dialogAlertSlice';
import { setReloadUser, setCanSave } from '../redux/user/userSlice';
import { setIsSaving } from '../redux/video/videoSlice';

import { postImageClip } from '../api/image/clip';
import { postImagePackage, updateImagePackage } from '../api/image/package';
import { updateUser } from '../api/user/user';
import { requestVideo } from '../api/mindslab';

import { pathnameEnum } from './constants/Pathname';
import { drawerWidth } from './constants/Drawer';

import { showAlert } from '../utils/AlertUtils';
import { avatarPoseEnum } from '../enums/AvatarPose';
import { avatarPositionValues } from '../enums/AvatarPosition';

const boxStyle = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center'
}

const Appbar = (props) => {
  const {
    /**
     * Current video
     */
    video,
    /**
     * Update the current video
     */
    setVideo,
    /**
     * Toggle drawer when screen has a small size
     */
    handleDrawerToggle, 
    /**
     * Canvas reference
     */
    canvasRef,
    /**
     * Save slide
     */
    onSaveSlide,
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
    openPlayVideo,
    /**
     * Change the preview video source
     */
    changeVideoSource
  } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const routeMatchEditor = useRouteMatch([`${pathnameEnum.editor}/:id`, `${pathnameEnum.editorTemplate}/:id`]);
  const routeMatchPreview = useRouteMatch([`${pathnameEnum.videos}/:id`, `${pathnameEnum.templates}/:id`]);

  const pathName = useSelector(state => state.navigation.pathName);
  // User settings page
  const canSaveUser = useSelector(state => state.user.canSave);
  const userUpdated = useSelector(state => state.user.userUpdated);
  // Editor page
  const activeSlide = useSelector(state => state.video.activeSlide);
  const isSaving = useSelector(state => state.video.isSaving);
  const selectedAvatar = useSelector(state => state.video.selectedAvatar);

  const [title, setTitle] = useState('');
  const [titleSaved, setTitleSaved] = useState('');
  
  const cannotUndo = canvasRef && !canvasRef.handler?.transactionHandler.undos.length;
  const cannotRedo = canvasRef && !canvasRef.handler?.transactionHandler.redos.length;
  const hasCanvasObjects = canvasRef && canvasRef.handler?.getObjects().length > 0;
  const isEditorPage = routeMatchEditor !== null;
  const isPreviewVideoPage = routeMatchPreview !== null;
  const isEditTemplate = isEditorPage && routeMatchEditor.url.includes("template");
  const isPreviewTemplate = isPreviewVideoPage && routeMatchPreview.url.includes("template");

  useEffect(() => {
    const pathname = history.location.pathname;
    dispatch(setPathName(pathname));

    if (isEditorPage) {
      setTitle(video.package_name);
      setTitleSaved(video.package_name);
    }
  }, []);

  const createNewImagePackage = async (isTemplate) => {
    dispatch(setShowBackdrop(true));

    const user = JSON.parse(sessionStorage.getItem('user'));
    const packageName = isTemplate ? 'New template' : 'New video';
    const imagePackage = {
      user_id: user.user_id,
      package_name: packageName,
      is_draft: true,
      is_template: isTemplate
    }
    const imageClip = {
      package_id: null,
      background_type: null,
      text_script: '',
      avatar_pose: avatarPoseEnum.all_around,
      avatar_position: avatarPositionValues.center,
      avatar_size: 100,
      clip_order: 1
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
      const path = `${isTemplate ? pathnameEnum.editorTemplate : pathnameEnum.editor}/${packageId}`;
      history.push(path);
    });
  }

  const handleChangeTitle = (event) => {
    setTitle(event.target.value);
  }

  const saveTitle = async () => {
    if (title !== '' && title !== titleSaved) {
      dispatch(setIsSaving(true));

      const id = routeMatchEditor.params.id;
      await updateImagePackage(id, { package_name: title }).then(() => {
        const updatedVideo = {
          ...video,
          package_name: title
        }
        setVideo(updatedVideo);

        setTitleSaved(title);
        dispatch(setIsSaving(false));
      });
    }
  }

  const onUndo = () => {
    canvasRef.handler?.transactionHandler.undo();
    setTimeout(() => onSaveSlide(), 100);
  }
  
  const onRedo = () => {
    canvasRef.handler?.transactionHandler.redo();
    setTimeout(() => onSaveSlide(), 100);
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

  const handleBackToTemplates = () => {
    history.push(pathnameEnum.templates);
  }

  const handleBackToAccount = () => {
    history.push(pathnameEnum.account);
  }

  const playVideo = async () => {
    if (isSaving) {
      showAlert('Please wait for changes to be saved.', 'warning')
      return;
    }
    
    const script = activeSlide.text_script;
    if (script === null || script === '') {
      showAlert('The slide has no script. Please type a script.', 'error')
      return;
    }

    if (selectedAvatar === null) {
      showAlert('You need to select an avatar.', 'error');
      return;
    }

    dispatch(setShowBackdrop(true));

    try {
      let file = null;
      let canvasImagePromise = new Promise((resolve, reject) => {
        try {
          const objects = canvasRef.handler?.getObjects();
          const avatar = objects.find(obj => obj.subtype && obj.subtype === 'avatar');
          if (avatar) {
            canvasRef.handler?.remove(avatar, true);
          }

          const canvasBlob = canvasRef.handler?.getCanvasImageAsBlob();
          file = new File([canvasBlob], "canvas.png", { type: "image/png" });

          if (avatar) {
            canvasRef.handler.clear();
            canvasRef.handler.importJSON(objects);
            canvasRef.handler.transactionHandler.state = objects;
          }

          resolve();
        } catch (error) {
          console.log(error);
          reject();
        }
      });
      
      canvasImagePromise.then(async () => {
        const videoData = {
          file: file,
          script: script,
          action: activeSlide.avatar_pose,
          model: activeSlide.avatar_type
        }

        await requestVideo(videoData).then((res) => {
          dispatch(setShowBackdrop(false));

          const blob = res.data;
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var b64 = reader.result.replace(/^data:.+;base64,/, '');
            var src = "data:video/webm;base64," + b64;
            changeVideoSource(src);
            openPlayVideo();
          }
        });
      },
      () => {
        showAlert('There was a problem while converting the canvas to image.', 'error');
        dispatch(setShowBackdrop(false));
      });
    } catch (error) {
      console.log(error);
      showAlert('An error occured while trying to play the video', 'error');
      dispatch(setShowBackdrop(false));
    }
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${isEditorPage ? '0' : drawerWidth}px)`, xl: `calc(100% - ${isEditorPage ? '0' : drawerWidth}px)` },
        ml: { lg: `${isEditorPage ? '0' : drawerWidth}px`, xl: `${isEditorPage ? '0' : drawerWidth}px` },
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
            sx={{ mr: 2, color: '#fff', display: { lg: isEditorPage ? 'block' : 'none', xl: isEditorPage ? 'block' : 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {pathName === pathnameEnum.home &&
            <Box sx={boxStyle}>
              <Typography variant="h5" sx={{ color: '#fff' }}>Create new video</Typography>
            </Box>
          }

          {pathName === pathnameEnum.videos &&
            <Box sx={boxStyle}>
              <Typography variant="h5" sx={{ color: '#fff' }}>All videos</Typography>
            </Box>
          }

          {pathName === pathnameEnum.templates &&
            <Box sx={boxStyle}>
              <Typography variant="h5" sx={{ color: '#fff' }}>Templates</Typography>
            </Box>
          }

          {isPreviewVideoPage &&
            <Box sx={boxStyle}>
              <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff", mr: 2, cursor: 'pointer' }} onClick={isPreviewTemplate ? handleBackToTemplates : handleBackToVideos} />
              <Typography variant="h5" sx={{ color: '#fff' }}>Back to {isPreviewTemplate ? 'templates' : 'videos'}</Typography>
            </Box>
          }

          {isEditorPage &&
            <CustomInput 
              value={title}
              onChange={handleChangeTitle}
              onBlur={saveTitle}
              startAdornment={
                <InputAdornment position="start">
                  <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff", cursor: 'pointer' }} onClick={isEditTemplate ? handleBackToTemplates : handleBackToVideos} />
                </InputAdornment>
              }
              sx={{ backgroundColor: '#3c4045' }}
            />
          }

          {pathName === pathnameEnum.avatars &&
            <Box sx={boxStyle}>
              <Typography variant="h5" sx={{ color: '#fff' }}>Avatars</Typography>
            </Box>
          }

          {pathName === pathnameEnum.account &&
            <Box sx={boxStyle}>
              <Typography variant="h5" sx={{ color: '#fff' }}>Account Settings</Typography>
            </Box>
          }

          {pathName === pathnameEnum.billing &&
            <Box sx={boxStyle}>
              <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#fff", mr: 2, cursor: 'pointer' }} onClick={handleBackToAccount} />
              <Typography variant="h5" sx={{ color: '#fff' }}>Billing information</Typography>
            </Box>
          }
        </Box>

        {/* Right part */}
        {pathName === pathnameEnum.home &&
          <Box sx={boxStyle}>
            {/* <Button variant="contained" color="secondary" sx={{ maxWidth: 'none', mr: 1, color: '#fff' }}>Import powerpoint</Button> */}
            <Button variant="contained" onClick={() => createNewImagePackage(false)}>Create new video</Button>
          </Box>
        }

        {pathName === pathnameEnum.videos &&
          <Box sx={boxStyle}>
            <Button variant="contained" onClick={() => createNewImagePackage(false)}>Create new video</Button>
          </Box>
        }

        {pathName === pathnameEnum.templates &&
          <Box sx={boxStyle}>
            <Button variant="contained" onClick={() => createNewImagePackage(true)}>Create new template</Button>
          </Box>
        }

        {isEditorPage && 
          <Box sx={boxStyle}>
            <Typography sx={{ mr: 1 }}>{isSaving ? 'Saving...' : 'All changes saved'}</Typography>
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
              sx={{ maxWidth: '100%', px: { xs: 1, lg: 2 }, mx: 2, backgroundColor: '#3c4045', border: 'none' }}
              onClick={openDiscardDraft}
            >
              {hasCanvasObjects ? "Discard draft" : "Cancel"}
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              sx={{ px: { xs: 1, lg: 7 }, mr: 2, backgroundColor: '#3c4045', border: 'none' }}
              onClick={playVideo}
            >
              Play
            </Button>
            <Button variant="contained" sx={{ px: { xs: 1, lg: 5 } }} onClick={openGenerateVideo}>
              {isEditTemplate ? 'Publish template' : 'Generate video'}
            </Button>
          </Box>
        }

        {pathName === pathnameEnum.avatars &&
          <Box sx={boxStyle}>
            <Button variant="contained">Request your own avatar</Button>
          </Box>
        }

        {pathName === pathnameEnum.account &&
          <Box sx={boxStyle}>
            <Button variant="contained" onClick={cancelUserChanges} disabled={!canSaveUser} color="secondary" sx={{ mr: 2, px: { xs: 1, sm: 7 } }}>Cancel</Button>
            <Button variant="contained" onClick={saveUser} disabled={!canSaveUser} sx={{ px: { xs: 1, sm: 8 } }}>Save</Button>
          </Box>
        }
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;