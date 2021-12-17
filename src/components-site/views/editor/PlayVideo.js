import React, { useEffect } from 'react';

import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PlayVideo = (props) => {
  const { open, close, source } = props;

  useEffect(() => {
    if (open) {
      const videoElt = document.getElementById('video');
      if (videoElt) {
        videoElt.addEventListener('loadedmetadata', () => addEventToVideo(videoElt));
      }

      return () => {
        const videoElt = document.getElementById('video');
        if (videoElt) {
          videoElt.removeEventListener('loadedmetadata', () => addEventToVideo(videoElt));
        }
      }
    }
  }, [open]);

  const addEventToVideo = (videoElt) => {
    if (videoElt.duration == Infinity) {
      videoElt.currentTime = 1e101;
      videoElt.ontimeupdate = function () {
        this.ontimeupdate = () => {
            return;
        }
        videoElt.currentTime = 0;
        return;
      }
    }
  }

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
        <video id="video" preload="auto" controls style={{ width: '100%', borderRadius: '6px' }}>
          <source src={source} type="video/mp4" />
          <source type="video/webm" src={source} />
        </video>
      </DialogContent>
    </Dialog>
  );
}
 
export default PlayVideo;