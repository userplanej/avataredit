import React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { showAlert } from '../../../utils/AlertUtils';

import { deleteImagePackage } from '../../../api/image/package';

import { pathnameEnum } from '../../constants/Pathname';

const DiscardDraft = (props) => {
  const { open, close } = props;
  const history = useHistory();
  const routeMatch = useRouteMatch(`${pathnameEnum.editor}/:id`);
  
  const doDiscardDraft = async () => {
    const id = routeMatch.params.id;
    await deleteImagePackage(id).then(() => {
      showAlert('Draft discarded successfully', 'success')
      history.push(pathnameEnum.videos);
    });
  }

  return (
    <Dialog
      maxWidth="md"
      open={open}
      aria-labelledby="generate-video-dialog-title"
      aria-describedby="generate-video-dialog-description"
    >
      <DialogTitle id="generate-video-dialog-title" sx={{ textAlign: 'right' }}>
        <CloseIcon fontSize="large" onClick={close} sx={{ cursor: 'pointer', color: '#fff' }} />
      </DialogTitle>

      <DialogContent sx={{ pl: 5, pr: 15 }}>
        <Typography variant="h4">Discard draft</Typography>
        <Typography variant="h5">By confirming draft will be permanently deleted.</Typography>
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