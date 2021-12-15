import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Grid, Box, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { postImageClip, deleteImageClip } from '../../../api/image/clip';
import { updateImagePackage } from '../../../api/image/package';

import { setActiveSlideId, setActiveSlide, setIsSaving, setSelectedAvatar } from '../../../redux/video/videoSlice';
import { setAvatarPosition, setAvatarPose, setAvatarSize } from '../../../redux/object/objectSlice';

import { showAlert } from '../../../utils/AlertUtils';

import { avatarPoseEnum } from '../../../enums/AvatarPose';
import { avatarPositionValues } from '../../../enums/AvatarPosition';

const ITEM_HEIGHT = 48;

const slideContainerStyle = {
  width: '100%',
  height: '150px',
  // height: '192px',
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

// const slideActiveContainerStyle = {
//   width: '100%',
//   height: '192px',
//   margin: '16px 0px 18px',
//   padding: '0',
//   backgroundColor: 'rgba(232, 233, 233, 0.4)',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   justifyContent: 'center'
// }

const addSlideContainerStyle = {
  minWidth: '185px',
  maxWidth: '185px',
  height: '128px',
  border: 'solid 2px #e8e9e9',
  color: '#fff',
  backgroundColor: '#3c4045',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': { 
    backgroundColor: 'rgba(232, 233, 233, 0.3)', 
    border: 'solid 2px #d1d1d1',
    cursor: 'pointer' 
  }
}

const btnAddTransitionStyle = {
  minWidth: '185px',
  maxWidth: '185px',
  height: '32px',
  marginTop: '8px',
  borderRadius: '4px',
  backgroundColor: '#3c4045',
  color: '#fff',
  textTransform: 'none',
  ':hover': {
    backgroundColor: 'rgba(232, 233, 233, 0.3)', 
  }
}

const Slides = (props) => {
  const { video, slides, canvasRef, packageId, loadSlides } = props;
  const dispatch = useDispatch();
  const activeSlideId = useSelector(state => state.video.activeSlideId);

  const [selectedSlideId, setSelectedSlideId] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    const clipId = video.clip_id;
    loadSlide(clipId);
  }, []);

  const saveVideoActiveClipId = async (id) => {
    const dataToSend = {
      clip_id: id
    }
    await updateImagePackage(packageId, dataToSend);
  }

  const addSlide = async () => {
    dispatch(setIsSaving(true));

    canvasRef.handler.clear(true);
    canvasRef.handler.workareaHandler.initialize();
    
    const objects = canvasRef.handler.exportJSON();
    const imageClip = {
      package_id: packageId,
      background_type: null,
      html5_script: JSON.stringify(objects),
      text_script: '',
      avatar_position: avatarPositionValues.center,
      avatar_pose: avatarPoseEnum.all_around,
      avatar_size: 100,
      clip_order: slides.length + 1
    }
    
    await postImageClip(imageClip).then((res) => {
      const clip = res.data.body;
      const clipId = res.data.body.clip_id;
      loadSlides();
      dispatch(setActiveSlide(clip));
      dispatch(setActiveSlideId(clipId));
      saveVideoActiveClipId(clipId);
      
      dispatch(setIsSaving(false));
    });
  }

  const changeSlide = async (id) => {
    if (id !== activeSlideId) {
      loadSlide(id);
      canvasRef.handler?.transactionHandler.initialize();
    }
  }

  const loadSlide = async (id) => {
    const slideToLoad = slides.find(slide => slide.clip_id === id);
    if (slideToLoad) {
      canvasRef.handler.clear(true);
      canvasRef.handler.workareaHandler.initialize();
      if (slideToLoad.html5_script !== null) {
        const objects = JSON.parse(slideToLoad.html5_script);
        await canvasRef.handler.importJSON(objects).then(() => {
          canvasRef.handler.transactionHandler.state = objects;
        });

        const avatar = objects.find(obj => obj.subtype === 'avatar');
        if (avatar) {
          dispatch(setSelectedAvatar(avatar));
          dispatch(setAvatarPosition(slideToLoad.avatar_position));
          dispatch(setAvatarSize(slideToLoad.avatar_size));
        } else {
          dispatch(setAvatarPosition(null));
          dispatch(setAvatarSize("100"));
        }
        dispatch(setAvatarPose(slideToLoad.avatar_pose));
      }
      dispatch(setActiveSlide(slideToLoad));
      dispatch(setActiveSlideId(id));
      saveVideoActiveClipId(id);
    }
  }

  const deleteSlide = async () => {
    // If there's only one slide, can't delete
    if (slides.length < 2) {
      showAlert('Deleting slide is not possible when there is only one slide.', 'error');
      return;
    }

    await deleteImageClip(selectedSlideId).then(() => {
      // TODO: Update slides order

      loadSlides();
      // If active slide is deleted, we need to load the first not deleted slide
      if (selectedSlideId === activeSlideId) {
        const firstSlide = slides.find(slide => slide.clip_id !== selectedSlideId);
        loadSlide(firstSlide.clip_id);
      }
    });
  }

  const copySlide = async () => {
    dispatch(setIsSaving(true));
    
    const selectedSlide = slides.find(slide => slide.clip_id === selectedSlideId);
    if (selectedSlide) {
      const imageClip = {
        ...selectedSlide,
        clip_order: slides.length + 1
      }
      delete imageClip.clip_id;
      delete imageClip.create_date;
      delete imageClip.update_date;

      await postImageClip(imageClip).then((res) => {
        const clip = res.data.body;
        const clipId = res.data.body.clip_id;
        loadSlides().then(() => loadSlide(clipId));
        dispatch(setActiveSlide(clip));
        dispatch(setActiveSlideId(clipId));
        saveVideoActiveClipId(clipId);
        
        dispatch(setIsSaving(false));
      });
    }
  }

  const handleClickMenu = (event, id) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedSlideId(id);
  };

  const handleCloseMenu = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleCopySlide = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    copySlide();
  }

  const handleDeleteSlide = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    deleteSlide();
  }

  const options = [
    {
      name: 'Copy',
      action: (event) => handleCopySlide(event)
    },
    {
      name: 'Delete',
      action: (event) => handleDeleteSlide(event)
    }
  ];

  return (
    <List>
      <Box sx={{ maxHeight: '650px', overflowY: 'auto' }}>
      {slides && slides.length > 0 && slides.map((slide, index) => {
        const slideId = slide.clip_id;
        const isActive = activeSlideId === slideId;
        const hasImage = slide.html5_dir !== null ;

        return (
          <ListItem
            key={index}
            sx={{ 
              ...slideContainerStyle,
              ':hover .slide-menu': {
                display: 'block'
              }
            }}
            // sx={isActive ? slideActiveContainerStyle : slideContainerStyle}
          >
            <Grid container /*sx={isActive ? { borderLeft: '4px solid #df678c' } : null}*/>
              <Grid item xs={1} md={1} xl={1.5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
                <Box>{index + 1}</Box>
                {/* <DragIndicatorIcon sx={{ mt: '28px', cursor: 'grab' }} /> */}
              </Grid>
              
              <Grid item xs={10} md={9} xl={10.5}>
                <Box
                  id={`slide-container-${slideId}`}
                  onClick={() => changeSlide(slideId)}
                  sx={{ 
                    minWidth: '185px',
                    maxWidth: '185px',
                    height: '128px',
                    border: isActive ? '3px solid #df678c' : null,
                    backgroundColor: !hasImage ? '#f7f7f7' : null,
                    backgroundImage: hasImage ? `url(${slide.html5_dir})` : '',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    display: 'flex',
                    justifyContent: 'right'
                  }}
                >
                  <MoreVertIcon
                    id={`slide-menu-btn-${slideId}`}
                    className="slide-menu"
                    onClick={(event) => handleClickMenu(event, slideId)}
                    sx={{
                      mt: 1,
                      mr: 1,
                      display: 'none',
                      float: 'right',
                      cursor: 'pointer'
                    }}
                  />
                </Box>

                <Menu
                  id={`slide-menu-${slideId}`}
                  MenuListProps={{
                    'aria-labelledby': `slide-menu-btn-${slideId}`,
                  }}
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleCloseMenu}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '10ch',
                    },
                  }}
                >
                  {options.map((option) => (
                    <MenuItem 
                      key={option.name}  
                      onClick={(event) => option.action(event)} 
                      sx={{ ':hover': { backgroundColor: '#f5f0fa' } }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
            </Grid>

            {/* <Grid container>
              <Grid item xs={1} md={1} xl={1.5}></Grid>
              <Grid item xs={10} md={9} xl={10.5}>
                <Button variant="contained" variant="secondary" sx={btnAddTransitionStyle}>
                  Add transitions
                </Button>
              </Grid>
            </Grid> */}
          </ListItem>
        )
      })}
      </Box>

      <ListItem 
        sx={{ ...slideContainerStyle, mt: 0 }}
      >
        <Grid container>
          <Grid item xs={1} md={1} xl={1.5}></Grid>

          <Grid item xs={10} md={9} xl={10.5}>
            <Box sx={addSlideContainerStyle} onClick={() => addSlide()}>
              <AddIcon sx={{ color: '#fff', mb: '10px', fontSize: '2rem' }} />
              <Typography sx={{ fontSize: '14px'}}>Add slides</Typography>
            </Box>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}
 
export default Slides;