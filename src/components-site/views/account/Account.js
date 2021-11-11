import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, InputLabel, Button, Link, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import CustomInput from '../../inputs/CustomInput';
import MultilineInput from '../../inputs/MultilineInput';

/**
 * Account settings page
 */
const Account = () => {
  // Inputs values
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  // Inputs helper text
  const [passwordHelperText, setPasswordHelperText] = useState('Both passwords must match');
  // Boolean to disable or enable submit button
  const [canSubmit, setCanSubmit] = useState(false);
  // Boolean to show change password dialog
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  // Boolean to tell if passwords are matching or not
  const [passwordMatch, setPasswordMatch] = useState(false);

  // Array to build passwords inputs
  const passwords = [
    {
      label: 'Current password',
      name: 'currentPassword',
      caption: 'Password must be at least 8 characters long. Must include at least one letter and one number.',
    },
    {
      label: 'New password',
      name: 'newPassword',
      caption: 'Password must be at least 8 characters long. Must include at least one letter and one number.'
    },
    {
      label: 'Confirm new password',
      name: 'confirmNewPassword'
    }
  ]

  // Open change password modal
  const openChangePassword = () => {
		setOpenChangePasswordDialog(true);
	}

  // Close change password modal
	const closeChangePassword = () => {
		setOpenChangePasswordDialog(false);
	}

  /**
   * Validate all inputs of this page, in particular password rules and password matching
   */
   const validateInputs = (password, newPassword, confirmNewPassword) => {
    let letter = /[a-zA-Z]/; 
    let number = /[0-9]/;

    const passwordValidation = password && password !== '';
    const newPasswordValidation = newPassword && newPassword !== '' && newPassword.length > 7 
      && letter.test(newPassword) && number.test(newPassword);
    let passwordMatch  = false;
    if (confirmNewPassword && confirmNewPassword !== '') {
      passwordMatch = confirmNewPassword === newPassword;
      setPasswordHelperText(passwordMatch ? 'Both password match' : 'Both passwords must match');
      setPasswordMatch(passwordMatch);
    }
    setCanSubmit(passwordValidation && newPasswordValidation && passwordMatch);
  }

  /**
   * Set the color of password text helper displayed below the confirm password input
   */
   const getColorPasswordHelper = () => {
    if (confirmNewPassword !== '') {
      return passwordMatch ? 'green' : 'error';
    }
    return null;
  }

  const onChangeValue = (inputName, value) => {
    switch (inputName) {
      case 'currentPassword':
        setCurrentPassword(value);
        validateInputs(value, newPassword, confirmNewPassword);
        break;
      case 'newPassword':
        setNewPassword(value);
        validateInputs(password, value, confirmNewPassword);
        break;
      case 'confirmNewPassword':
        setConfirmNewPassword(value);
        validateInputs(password, newPassword, value);
        break;
      default:
        break;
    }
  }

  // Get value of corresponding input
  const getInputValue = (inputName) => {
    switch (inputName) {
      case 'currentPassword':
        return currentPassword;
      case 'newPassword':
        return newPassword;
      case 'confirmNewPassword':
        return confirmNewPassword;
      default:
        return null;
    }
  }

  // Return the input with label and caption for each password inputs
  const getPasswordInput = (label, name, caption) => {
    return (
      <Box key={name}>
        <InputLabel sx={{ mt: '20px' }}>{label}</InputLabel>
        <CustomInput 
          placeholder={`Type your ${label.toLowerCase()}`}
          fullWidth 
          type="password"
          id={name}
          name={name}
          value={getInputValue(name)}
          onChange={(event) => onChangeValue(name, event.target.value)}
        />

        <Typography variant="caption" color={name === 'confirmNewPassword' ? getColorPasswordHelper() : null}>
          {name === 'confirmNewPassword' ? passwordHelperText : caption}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 10, ml: 4, width: '100%' }}>
      <Typography variant="h5" color="#fff">Account information</Typography>

      <Grid container sx={{ mt: 2, width: '100%' }}>
        <Grid item xs={9} md={6} xl={4}>
          <InputLabel>Email</InputLabel>
          <CustomInput 
            placeholder="Email" 
            fullWidth  
            id="email"
            type="email" 
            name="email"
            autoComplete="email"
            // onChange={onChangeEmail}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 1, width: '100%' }}>
        <InputLabel>Password</InputLabel>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <Grid item xs={9} md={6} xl={4}>
            <CustomInput 
              placeholder="**********" 
              fullWidth  
              id="password"
              type="password" 
              name="password"
              autoComplete="password"
              // onChange={onChangePassword}
            />
          </Grid>
          
          <Grid item xs={3} md={3} xl={2} sx={{ pl: 1 }}>
            <Button variant="contained" color="secondary" fullWidth onClick={openChangePassword}>Change</Button>
          </Grid>
        </Box>
      </Grid>

      <Box sx={{ mt: 2, color: '#fff' }}>
        {"To cancel your account, "}
        <Link color="#df678c">please click here.</Link>
      </Box>

      <Typography variant="h5" color="#fff" sx={{ mt: 3 }}>Personal information</Typography>

      <Grid container sx={{ mt: 2, width: '100%' }}>
        <Grid item xs={9} md={6} xl={4}>
          <InputLabel>Name</InputLabel>
          <CustomInput 
            placeholder="Name" 
            fullWidth  
            id="name"
            name="name"
            autoComplete="name"
            // onChange={onChangeName}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 2, width: '100%' }}>
        <Grid item xs={9} md={6} xl={4}>
          <InputLabel>Short bio</InputLabel>
          <MultilineInput 
            placeholder="Short bio"
            minRows={4}
            maxRows={4} 
            id="bio"
            name="bio"
            // onChange={onChangeBio}
            sx={{ boxShadow: '3px 3px 6px 0 rgb(0 0 0 / 2%)' }}
          />
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 3 }}>Notifications</Typography>

      <Box sx={{ mt: 1.5, ml: 1 }}>
        <Grid container>
          <Grid item><FormControlLabel control={<Switch defaultChecked sx={{ mr: 1 }} />} label="Video processing complete" sx={{ color: '#fff' }} /></Grid>
        </Grid>

        <Grid container sx={{ mt: 2 }}>
          <Grid item><FormControlLabel control={<Switch sx={{ mr: 1 }} />} label="Product updates" sx={{ color: '#fff' }} /></Grid>
        </Grid>
      </Box>

      <Dialog
        maxWidth="md"
        open={openChangePasswordDialog}
        onClose={closeChangePassword}
        aria-labelledby="password-dialog-title"
        aria-describedby="password-dialog-description"
      >
        <DialogTitle id="password-dialog-title" sx={{ textAlign: 'right' }}>
          <CloseIcon fontSize="large" onClick={closeChangePassword} sx={{ cursor: 'pointer', color: '#fff' }} />
        </DialogTitle>

        <DialogContent>
          <Typography variant="h5" color="#fff">
            Change password
          </Typography>

          {passwords.map(password => getPasswordInput(password.label, password.name, password.caption))}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="secondary" fullWidth onClick={closeChangePassword}>
            Cancel
          </Button>

          <Button disabled={!canSubmit} variant="contained" fullWidth onClick={closeChangePassword}>
            Save and proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
 
export default Account;