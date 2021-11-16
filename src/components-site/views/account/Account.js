import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, InputLabel, Button, Link, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import CustomInput from '../../inputs/CustomInput';
import MultilineInput from '../../inputs/MultilineInput';

import { setCanSave, setUserUpdated, setReloadUser } from '../../../redux/user/userSlice';
import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';
import { setDialogAlertTitle, setDialogAlertMessage, setDialogAlertButtonText, setDialogAlertOpen } from '../../../redux/dialog-alert/dialogAlertSlice';

import { getUser, updateUser } from '../../../api/user/user';
import { showAlert } from '../../../utils/AlertUtils';

const fieldNames = {
  email: 'email',
  currentPassword: 'currentPassword',
  newPassword: 'newPassword',
  confirmNewPassword: 'confirmNewPassword',
  name: 'name',
  bio: 'bio'
}

/**
 * Account settings page
 */
const Account = () => {
  const dispatch = useDispatch();
  const userUpdated = useSelector(state => state.user.userUpdated);
  const reloadUser = useSelector(state => state.user.reloadUser);
  
  // User current data
  const [user, setUser] = useState(null);
  // Inputs values
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
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
      name: fieldNames.currentPassword,
      caption: 'Password must be at least 8 characters long. Must include at least one letter and one number.',
    },
    {
      label: 'New password',
      name: fieldNames.newPassword,
      caption: 'Password must be at least 8 characters long. Must include at least one letter and one number.'
    },
    {
      label: 'Confirm new password',
      name: fieldNames.confirmNewPassword
    }
  ]

  useEffect(() => {
    getUserData();
  }, [reloadUser]);

  const getUserData = async () => {
    dispatch(setShowBackdrop(true));

    const user = JSON.parse(sessionStorage.getItem('user'));
    await getUser(user.user_id).then((res) => {
      const data = res.data.body;
      // Set inputs values
      setEmail(data.email);
      setName(data.name);
      setBio(data.bio);

      // Store current values of user's data so we can check if there's a modification
      const user = {
        userId: data.user_id,
        email: data.email,
        name: data.name ? data.name : '',
        bio: data.bio ? data.bio : '',
        // currentPassword: data.currentPassword
      }
      setUser(user);

      // Store current values to initialize user data to be updated
      dispatch(setUserUpdated(user));
      dispatch(setReloadUser(false));
      dispatch(setShowBackdrop(false));
    });
  }

  // Open change password modal
  const openChangePassword = () => {
		setOpenChangePasswordDialog(true);
	}

  // Close change password modal
	const closeChangePassword = () => {
		setOpenChangePasswordDialog(false);
    resetPasswordInputs();
	}

  /**
   * Validate all inputs of this page, in particular password rules and password matching
   */
   const validateInputs = (currentPassword, newPassword, confirmNewPassword) => {
    let letter = /[a-zA-Z]/; 
    let number = /[0-9]/;

    const passwordValidation = currentPassword && currentPassword !== '';
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

  const checkValuesChanged = (inputName, value) => {
    let canSave = false;
    const newUserUpdated = { ...userUpdated }

    switch (inputName) {
      case fieldNames.email:
        newUserUpdated.email = value;
        canSave = user.email !== value;
        break;
      case fieldNames.name:
        newUserUpdated.name = value;
        canSave = user.name !== value;
        break;
      case fieldNames.bio:
        newUserUpdated.bio = value;
        canSave = user.bio !== value;
        break;
      default:
        break;
    }
    
    dispatch(setUserUpdated(newUserUpdated));
    dispatch(setCanSave(canSave));
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
      case fieldNames.currentPassword:
        setCurrentPassword(value);
        validateInputs(value, newPassword, confirmNewPassword);
        break;
      case fieldNames.newPassword:
        setNewPassword(value);
        validateInputs(currentPassword, value, confirmNewPassword);
        break;
      case fieldNames.confirmNewPassword:
        setConfirmNewPassword(value);
        validateInputs(currentPassword, newPassword, value);
        break;
      case fieldNames.email:
        setEmail(value);
        checkValuesChanged(inputName, value);
        break;
      case fieldNames.name:
        setName(value);
        checkValuesChanged(inputName, value);
        break;
      case fieldNames.bio:
        setBio(value);
        checkValuesChanged(inputName, value);
        break;
      default:
        break;
    }
  }

  // Get value of corresponding input
  const getInputValue = (inputName) => {
    switch (inputName) {
      case fieldNames.currentPassword:
        return currentPassword;
      case fieldNames.newPassword:
        return newPassword;
      case fieldNames.confirmNewPassword:
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

        <Typography variant="caption" color={name === fieldNames.confirmNewPassword ? getColorPasswordHelper() : null}>
          {name === 'confirmNewPassword' ? passwordHelperText : caption}
        </Typography>
      </Box>
    );
  }

  const saveChangePassword = async (event) => {
    event.preventDefault();

    const dataToSend = {
      currentPassword: currentPassword,
      password: newPassword,
      password_confirm: confirmNewPassword
    }

    await updateUser(user.userId, dataToSend)
    .then(() => {
      setOpenChangePasswordDialog(false);
      resetPasswordInputs();
      // Show dialog success
      dispatch(setDialogAlertTitle('Change password'));
      dispatch(setDialogAlertMessage('Password changed successfully'));
      dispatch(setDialogAlertButtonText('Done'));
      dispatch(setDialogAlertOpen(true));
    }).catch(error => {
      let message = '';
      if (error.response) {
        message = 'Current password is incorrect.';
      } else if (error.request) {
        message = error.request;
      } else {
        message = error;
      }
      showAlert(message, 'error');
    });
  }

  const resetPasswordInputs = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setCanSubmit(false);
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
            value={email}
            onChange={(event) => onChangeValue(fieldNames.email, event.target.value)}
          />
        </Grid>
      </Grid>

      <Grid container sx={{ mt: 1, width: '100%' }}>
        <InputLabel>Password</InputLabel>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <Grid item xs ={9} md={6} xl={4}>
            <CustomInput 
              value="**********" 
              fullWidth  
              id="password"
              type="password" 
              name="password"
              autoComplete="password"
              disabled
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
            onChange={(event) => onChangeValue(fieldNames.name, event.target.value)}
            value={name}
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
            onChange={(event) => onChangeValue(fieldNames.bio, event.target.value)}
            sx={{ boxShadow: '3px 3px 6px 0 rgb(0 0 0 / 2%)' }}
            value={bio}
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
        aria-labelledby="password-dialog-title"
        aria-describedby="password-dialog-description"
      >
        <Box component="form" onSubmit={saveChangePassword} noValidate width="100%">
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

            <Button type="submit" disabled={!canSubmit} variant="contained" fullWidth onClick={saveChangePassword}>
              Save and proceed
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}
 
export default Account;