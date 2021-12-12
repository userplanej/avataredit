import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, ClickAwayListener, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';

import CustomInput from '../../inputs/CustomInput';

import { uploadFile } from '../../../api/s3';
import { postOutput } from '../../../api/output/output';
import { updateImagePackage } from '../../../api/image/package';
import { requestVideo } from '../../../api/mindslab';

import { showAlert } from '../../../utils/AlertUtils';

import { pathnameEnum } from '../../constants/Pathname';

const labelStyle = {
  color: "#9a9a9a",
  mt: 3
}

const GenerateVideo = (props) => {
  const { canvasRef, video, slides, open, close } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const activeSlide = useSelector(state => state.video.activeSlide);
  const selectedAvatar = useSelector(state => state.video.selectedAvatar);

  const [title, setTitle] = useState(video.package_name);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [description, setDescription] = useState('Insert your description here');
  const [isEditDescription, setIsEditDescription] = useState(false);

  useEffect(() => {
    setTitle(video.package_name);
  }, [video]);

  const handleEditTitle = () => {
    setIsEditTitle(true);
  }

  const handleEditDescription = () => {
    setIsEditDescription(true);
  }

  const onChangeTitle = (value) => {
    setTitle(value);
  }

  const onChangeDescription = (value) => {
    setDescription(value);
  }

  const handleLeaveEditTitle = () => {
    setIsEditTitle(false);
  }

  const handleLeaveEditDescription = () => {
    setIsEditDescription(false);
  }
  
  const handleClose = () => {
    close();
    setTitle(video.package_name);
  }

  const doGenerateVideo = async () => {
    const script = activeSlide.text_script;
    if (script === null || script === '') {
      showAlert('The slide has no script. Please type a script.', 'error');
      return;
    }

    if (selectedAvatar === null) {
      showAlert('You need to select an avatar.', 'error');
      return;
    }

    close();
    dispatch(setShowBackdrop(true));

    // Set video as permanent and change title
    updateImagePackage(video.package_id, { is_draft: false, package_name: title });

    try {
      let file = null;
      let canvasImagePromise = new Promise((resolve, reject) => {
        try {
          const objects = canvasRef.handler?.getObjects();
          const avatar = objects.find(obj => obj.subtype && obj.subtype === 'avatar');
          if (avatar) {
            canvasRef.handler?.removeById(avatar.id);
          }

          const canvasBlob = canvasRef.handler?.getCanvasImageAsBlob();
          file = new File([canvasBlob], "canvas", { type: "image/png" });

          if (avatar) {
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
        requestVideo(file, script).then(async (res) => {
          const blob = res.data;
          const filename = `${video.package_name}-${new Date().getTime()}.mp4`;
          const file = new File([blob], filename, { type: "video/mp4" });
          const formData = new FormData();
          formData.append('files', file);

          await uploadFile(formData, 'generated-video').then((res) => { 
            const upload = res.data.body[0];
            const user = JSON.parse(sessionStorage.getItem('user'));
            const dataToSend = {
              video_id: video.package_id,
              user_id: user.user_id,
              video_name: title,
              video_dir: upload.file_dir,
              description: description
            }

            postOutput(dataToSend).then(() => {
              dispatch(setShowBackdrop(false));
              const path = video.is_template ? pathnameEnum.templates : pathnameEnum.videos;
              history.push(`${path}/${video.package_id}`);
            });
          });
        });
      },
      () => {
        showAlert('There was a problem while converting the canvas to image.', 'error');
        dispatch(setShowBackdrop(false));
      });
    } catch (error) {
      console.log(error);
      showAlert('An error occured while trying to generate the video', 'error');
      dispatch(setShowBackdrop(false));
    }
  }

  const getSrcThumbnail = () => {
    if (selectedAvatar.option) {
      return selectedAvatar.option.src_thumbnail;
    }
    return selectedAvatar.src_thumbnail;
  }

  return (
    <Dialog
      maxWidth="md"
      open={open}
      aria-labelledby="generate-video-dialog-title"
      aria-describedby="generate-video-dialog-description"
    >
      <DialogTitle id="generate-video-dialog-title" sx={{ textAlign: 'right' }}>
        <CloseIcon fontSize="large" onClick={handleClose} sx={{ cursor: 'pointer', color: '#fff' }} />
      </DialogTitle>

      <DialogContent sx={{ pl: 5, pr: 15 }}>
        <Box sx={{ display: 'flex' }}>
          <Box 
            sx={{
              backgroundColor: '#fff',
              width: '200px',
              height: '200px',
              borderRadius: '260px',
              mr: 10,
              backgroundImage: selectedAvatar ? `url(${getSrcThumbnail()})` : '',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}
          />
          
          <Box>
            <Typography variant="h4">Video summary</Typography>
            <Typography variant="h5">{selectedAvatar ? selectedAvatar.name : ''} Avatar</Typography>
          </Box>
        </Box>
        
        <InputLabel sx={labelStyle}>Title</InputLabel>
        {!isEditTitle && 
          <Typography variant="h6" sx={{ color: "#fff", display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleEditTitle}>
            {title} <EditIcon fontSize="small" sx={{ ml: 1 }} />
          </Typography>
        }
        {isEditTitle && 
          <ClickAwayListener onClickAway={handleLeaveEditTitle}>
            <Box>
              <CustomInput 
                value={title}
                fullWidth
                onChange={(event) => onChangeTitle(event.target.value)}
                sx={{ backgroundColor: '#3c4045' }}
              />
            </Box>
          </ClickAwayListener>
        }
        
        <InputLabel sx={labelStyle}>Description</InputLabel>
        {!isEditDescription && 
          <Typography variant="h6" sx={{ color: "#fff", display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleEditDescription}>
            {description} <EditIcon fontSize="small" sx={{ ml: 1 }} />
          </Typography>
        }
        {isEditDescription && 
          <ClickAwayListener onClickAway={handleLeaveEditDescription}>
            <Box>
              <CustomInput 
                value={description}
                fullWidth
                onChange={(event) => onChangeDescription(event.target.value)}
                sx={{ backgroundColor: '#3c4045' }}
              />
            </Box>
          </ClickAwayListener>
        }

        <InputLabel sx={labelStyle}>Script</InputLabel>
        <Box sx={{ overflow: 'hidden', maxHeight: '80px' }}>
          {slides && slides.map(slide => {
            return (
              <Typography key={slide.clip_id} variant="h6" sx={{ color: "#fff" }}>
                {slide.text_script} 
              </Typography>
            );
          })}
        </Box>

        <InputLabel sx={labelStyle}>Estimated time</InputLabel>
        <Typography variant="h6" sx={{ color: "#fff" }}>2 min</Typography>
      </DialogContent>
      
      <DialogActions>
        <Button variant="contained" color="secondary" fullWidth onClick={close}>
          Cancel
        </Button>

        <Button variant="contained" fullWidth onClick={doGenerateVideo}>
          Save and proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
export default GenerateVideo;