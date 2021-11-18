import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, InputLabel, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import CustomInput from '../../inputs/CustomInput';

import { showAlert } from '../../../utils/AlertUtils';

const listDeleteReasons = [
  'I am waiting for the API',
  'I don\'t need to create more videos right now',
  'Pricing',
  'I would like a wider selection of actors',
  'I need more features for my use case',
  'I am not satisfied with the video/voice quality and options'
]

const DeleteAccount = (props) => {
  const {
    open,
    close
  } = props;

  const [email, setEmail] = useState('');
  const [showEnterEmail, setShowEnterEmail] = useState(true);
  const [showFinalPage, setShowFinalPage] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [reasonId, setReasonId] = useState(0);

  useEffect(() => {
    setEmail('');
    setCanSubmit(false);
    if (open) {
      setReasonId(0);
      setShowFinalPage(false);
      setShowEnterEmail(true);
    }
  }, [open]);

  const validateEmail = (email) => {
    const emailRegex = /.+@.+\..+/;
    return email && email !== '' && emailRegex.test(email);
  }

  const onChangeEmail = (value) => {
    setEmail(value);
    setCanSubmit(validateEmail(value));
  }

  const onClickReason = (id) => {
    setReasonId(id);
  }

  const handleSubmitEmail = (event) => {
    event.preventDefault();

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user.email === email) {
      setShowEnterEmail(false);
    } else {
      const message = 'Incorrect email.';
      showAlert(message, 'error');
    }
  }

  const handleBackToEnterEmail = () => {
    setShowEnterEmail(true);
  }

  const handleCloseFinalPage = () => {
    // TODO: Remove account and logout (remove sessionStorage and redirect to login page)
    close();
  }

  const getEnterEmail = () => {
    return (
      <Box component="form" onSubmit={handleSubmitEmail} noValidate width="100%">
        <DialogTitle id="delete-account-dialog-title" sx={{ textAlign: 'right' }}>
          <CloseIcon fontSize="large" onClick={close} sx={{ cursor: 'pointer', color: '#fff' }} />
        </DialogTitle>

        <DialogContent>
          <Typography variant="h5" color="#fff">
            We're sorry to see you go!
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            Enter the email associated with your account
          </Typography>

          <InputLabel>Email</InputLabel>
          <CustomInput 
            placeholder="Type your current email" 
            fullWidth  
            id="email"
            type="email" 
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => onChangeEmail(event.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="secondary" fullWidth onClick={close}>
            Cancel
          </Button>

          <Button type="submit" disabled={!canSubmit} variant="contained" fullWidth onClick={handleSubmitEmail}>
            Next
          </Button>
        </DialogActions>
      </Box>
    );
  }

  const getDeleteReason = () => {
    return (
      <Box width="100%">
        <DialogTitle id="delete-account-dialog-title" sx={{ textAlign: 'right' }}>
          <CloseIcon fontSize="large" onClick={close} sx={{ cursor: 'pointer', color: '#fff' }} />
        </DialogTitle>

        <DialogContent sx={{ width: '100%' }}>
          <Typography variant="h5" color="#fff">
            Would you mind telling us why would you like to cancel?
          </Typography>
          
          <Stack spacing={1} sx={{ mt: 2 }}>
            {listDeleteReasons.map((reason, key) =>
            <Box width="100%">
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth 
                key={key} 
                sx={{ color: reasonId === key ? '#fff' : null, maxWidth: 'none' }}
                onClick={() => onClickReason(key)}
              >
                {reason}
              </Button>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="secondary" fullWidth onClick={handleBackToEnterEmail}>
            Back
          </Button>

          <Button type="submit" disabled={!canSubmit} variant="contained" fullWidth onClick={() => setShowFinalPage(true)}>
            Next
          </Button>
        </DialogActions>
      </Box>
    );
  }

  const getFinalPage = () => {
    return (
      <Box width="100%">
        <DialogTitle id="delete-account-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src="/images/please.png" style={{ width: '30px' }} />
          <CloseIcon fontSize="large" onClick={handleCloseFinalPage} sx={{ cursor: 'pointer', color: '#fff' }} />
        </DialogTitle>

        <DialogContent sx={{ width: '100%' }}>
          <Typography variant="h5" color="#fff">
            Thank you for helping us make the product better
          </Typography>
          
          <Typography variant="subtitle1">
            Our team will now process your request and you’ll receive an email
          </Typography>

          <Typography variant="subtitle1" mt={4}>
            We hope to see you soon
          </Typography>
        </DialogContent>
      </Box>
    );
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      aria-labelledby="delete-account-dialog-title"
      aria-describedby="delete-account-dialog-description"
    >
      {!showFinalPage && showEnterEmail && getEnterEmail()}
      {!showFinalPage && !showEnterEmail && getDeleteReason()}
      {showFinalPage && getFinalPage()}
    </Dialog>
  );
}
 
export default DeleteAccount;