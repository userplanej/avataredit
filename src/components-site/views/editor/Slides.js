import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Grid, Box, Menu, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PanoramaIcon from '@mui/icons-material/Panorama';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { postImageClip, updateImageClip, getAllImageClipByPackageId, deleteImageClip } from '../../../api/image/clip';
import { updateImagePackage } from '../../../api/image/package';
import { uploadFile } from '../../../api/s3';

import { setSlides, setActiveSlideId } from '../../../redux/video/videoSlice';
import { showAlert } from '../../../utils/AlertUtils';

const ITEM_HEIGHT = 48;

const slideContainerStyle = {
  width: '100%',
  height: '192px',
  margin: '5px 0px 5px',
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
  width: '100%',
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
  const { canvasRef, packageId } = props;
  const dispatch = useDispatch();
  const video = useSelector(state => state.video.video);
  const slides = useSelector(state => state.video.slides);
  const activeSlideId = useSelector(state => state.video.activeSlideId);

  const [selectedSlideId, setSelectedSlideId] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    loadSlide(video.clip_id);
    dispatch(setActiveSlideId(video.clip_id));
  }, []);
  
	const loadAllSlides = async () => {
		await getAllImageClipByPackageId(packageId).then(res => {
			const slides = res.data.body.rows;
			dispatch(setSlides(slides));
		});
	}

  const saveVideoActiveClipId = async (id) => {
    const dataToSend = {
      clip_id: id
    }
    await updateImagePackage(packageId, dataToSend);
  }

  const addSlide = async () => {
    saveCurrentSlide();

    // Clear canvas
    canvasRef.handler.clear(true);
    canvasRef.handler.workareaHandler.initialize();
    
    const objects = canvasRef.handler.exportJSON();
    const imageClip = {
      package_id: packageId,
      background_type: null,
      html5_script: JSON.stringify(objects)
    }
    
    await postImageClip(imageClip).then((res) => {
      const clipId = res.data.body.clip_id;
      loadAllSlides();
      dispatch(setActiveSlideId(clipId));
      saveVideoActiveClipId(clipId);
    });
  }

  const saveCurrentSlide = async () => {
    // const canvasBlob = canvasRef.handler.getCanvasImageAsBlob();
    // const fileName = `video-${packageId}-slide-${activeSlideId}`;
    // const file = new File([canvasBlob], fileName, { type: "image/png" });

    // const formData = new FormData();
    // formData.append('adminId', 'admin1018');
    // formData.append('images', file);

    // await uploadFile(formData, 'slide-thumbnail').then((res) => {
    //   const location = res.data.body.location;
      const objects = canvasRef.handler.exportJSON();
      const dataToSend = {
        html5_script: JSON.stringify(objects),
        // html5_dir: location
      }
      await updateImageClip(activeSlideId, dataToSend);
    // });
  }

  const changeSlide = (id) => {
    if (id === activeSlideId) {
      return;
    }

    saveCurrentSlide().then(() => {
      loadSlide(id);
      loadAllSlides();
    });
  }

  const loadSlide = (id) => {
    const slideToLoad = slides.find(slide => slide.clip_id === id);
    if (slideToLoad) {
      canvasRef.handler.clear(true);
      canvasRef.handler.importJSON(JSON.parse(slideToLoad.html5_script));
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
      loadAllSlides();
      // If active slide is deleted, we need to load the first not deleted slide
      if (selectedSlideId === activeSlideId) {
        const firstSlide = slides.find(slide => slide.clip_id !== selectedSlideId);
        loadSlide(firstSlide.clip_id);
      }
    });
  }

  const copySlide = async () => {
    saveCurrentSlide().then(async () => {
      const selectedSlide = slides.find(slide => slide.clip_id === selectedSlideId);
      if (selectedSlide) {
        const imageClip = {
          package_id: packageId,
          background_type: selectedSlide.background_type,
          html5_script: selectedSlide.html5_script,
          html5_dir: selectedSlide.html5_dir
        }

        await postImageClip(imageClip).then((res) => {
          const clipId = res.data.body.clip_id;
          loadAllSlides().then(() => loadSlide(clipId));
          dispatch(setActiveSlideId(clipId));
          saveVideoActiveClipId(clipId);
        });
      }
    });
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
        const hasImage = false;//slide.html5_dir !== null ;

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
            onClick={() => changeSlide(slideId)}
          >
            <Grid container /*sx={isActive ? { borderLeft: '4px solid #df678c' } : null}*/>
              <Grid item xs={1} md={1} xl={1} sx={{ px: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff' }}>
                <Box>{index + 1}</Box>
                {/* <DragIndicatorIcon sx={{ mt: '28px', cursor: 'grab' }} /> */}
              </Grid>
              
              <Grid item xs={10} md={9} xl={9}>
                <Box 
                  sx={{ 
                    minWidth: '185px',
                    maxWidth: '185px',
                    height: '128px',
                    border: isActive ? '3px solid #df678c' : null,
                    backgroundColor: !hasImage ? '#fff' : null,
                    backgroundImage: hasImage ? `url(${slide.html5_dir})` : '',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative'
                  }}
                >
                  {!hasImage && <PanoramaIcon />}
                </Box>

                <MoreVertIcon 
                  id={`slide-menu-btn-${slideId}`}
                  className="slide-menu" 
                  onClick={(event) => handleClickMenu(event, slideId)} 
                  sx={{ display: 'none', position: 'absolute', top: '20px', left: '190px', cursor: 'pointer' }} 
                />

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

            <Grid container /*sx={isActive ? { borderLeft: '4px solid #e8e9e9'} : null}*/>
              <Grid item xs={1} md={1} xl={1} sx={{ px: 2 }}></Grid>
              <Grid item xs={10} md={9} xl={9}>
                <Button variant="contained" variant="secondary" sx={btnAddTransitionStyle}>
                  Add transitions
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        )
      })}
      </Box>

      <ListItem 
        sx={{ ...slideContainerStyle, mt: 0 }}
        onClick={() => addSlide()}
      >
        <Grid container>
          <Grid item xs={1} md={1} xl={1} sx={{ px: 2 }}></Grid>

          <Grid item xs={10} md={9} xl={9} sx={addSlideContainerStyle}>
            <AddIcon sx={{ color: '#fff', mb: '10px', fontSize: '2rem' }} />
            <Typography sx={{ fontSize: '14px'}}>Add slides</Typography>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}
 
export default Slides;