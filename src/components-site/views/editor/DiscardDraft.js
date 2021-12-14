import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { showAlert } from '../../../utils/AlertUtils';

import { deleteImagePackage } from '../../../api/image/package';

import { pathnameEnum } from '../../constants/Pathname';

const DiscardDraft = (props) => {
  const { open, close } = props;
  const history = useHistory();
  const routeMatch = useRouteMatch([`${pathnameEnum.editor}/:id`, `${pathnameEnum.editorTemplate}/:id`]);
  
  const doDiscardDraft = async () => {
    const id = routeMatch.params.id;
    await deleteImagePackage(id).then(() => {
      showAlert('Draft discarded successfully', 'success');
      const isTemplate = routeMatch !== null && routeMatch.url.includes("template");
      history.push(isTemplate ? pathnameEnum.templates : pathnameEnum.videos);
    });
  }

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      aria-labelledby="generate-video-dialog-title"
      aria-describedby="generate-video-dialog-description"
    >
      <DialogTitle id="generate-video-dialog-title" sx={{ textAlign: 'right' }}>
        <CloseIcon fontSize="large" onClick={close} sx={{ cursor: 'pointer', color: '#fff' }} />
      </DialogTitle>

      <DialogContent sx={{ color: "#9a9a9a" }}>
        <Typography variant="h5" color="#fff" sx={{ mb: 2 }}>Discard draft</Typography>
        By confirming draft will be permanently deleted.
      </DialogContent>
      
      <DialogActions>
        <Button variant="contained" color="secondary" fullWidth onClick={close}>
          Cancel
        </Button>

        <Button variant="contained" fullWidth onClick={doDiscardDraft}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
export default DiscardDraft;