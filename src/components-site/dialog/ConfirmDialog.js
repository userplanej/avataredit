import React from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Confirm dialog for actions like delete for example.
 * 
 * @param {object} props Component properties
 */
const ConfirmDialog = (props) => {
  const {
    /**
     * Boolean to show/hide dialog
     */
    open,
    /**
     * Action to close the dialog
     */
    close,
    /**
     * Dialog title
     */
    title,
    /**
     * Dialog content text
     */
    text,
    /**
     * Action when clicking on confirm
     */
    onConfirm
  } = props;

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title" sx={{ textAlign: 'right' }}>
        <CloseIcon fontSize="large" onClick={close} sx={{ cursor: 'pointer', color: '#fff' }} />
      </DialogTitle>

      <DialogContent sx={{ color: "#9a9a9a" }}>
        <Typography variant="h5" color="#fff" sx={{ mb: 2 }}>
          {title}
        </Typography>

        {text}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="secondary" fullWidth onClick={close}>
          Cancel
        </Button>
        <Button variant="contained" fullWidth onClick={onConfirm}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
export default ConfirmDialog;