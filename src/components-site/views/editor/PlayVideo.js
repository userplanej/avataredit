import React from 'react';

import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PlayVideo = (props) => {
  const { open, close, source } = props;

  return (
    <Dialog
      maxWidth="xl"
      open={open}
      aria-labelledby="preview-video-dialog-title"
      aria-describedby="preview-video-dialog-description"
    >
      <DialogTitle id="preview-video-dialog-title" sx={{ textAlign: 'right' }}>
        <CloseIcon fontSize="large" onClick={close} sx={{ cursor: 'pointer', color: '#fff' }} />
      </DialogTitle>

      <DialogContent>
        <video controls><source src={source} type="video/mp4" /></video>
      </DialogContent>
    </Dialog>
  );
}
 
export default PlayVideo;