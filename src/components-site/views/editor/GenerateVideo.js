import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle, ClickAwayListener, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import CustomInput from '../../inputs/CustomInput';

const labelStyle = {
  color: "#9a9a9a",
  mt: 3
}

const GenerateVideo = (props) => {
  const { video, slides, open, close } = props;
  // const video = useSelector(state => state.video.video);
  // const slides = useSelector(state => state.video.slides);

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
              mr: 10
            }}
          />
          
          <Box>
            <Typography variant="h4">Video summary</Typography>
            <Typography variant="h5">Avatar</Typography>
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
        <Typography variant="h6" sx={{ color: "#fff" }}>4 min</Typography>
      </DialogContent>
      
      <DialogActions>
        <Button variant="contained" color="secondary" fullWidth onClick={close}>
          Cancel
        </Button>

        <Button variant="contained" fullWidth onClick={close}>
          Save and proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
export default GenerateVideo;