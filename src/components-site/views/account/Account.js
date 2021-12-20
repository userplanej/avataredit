import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import i18n from 'i18next';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid, InputLabel, Button, Link, FormControlLabel, Switch, Dialog, DialogTitle, DialogContent, DialogActions, Container } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import DeleteAccount from './DeleteAccount';
import CustomInput from '../../inputs/CustomInput';
import MultilineInput from '../../inputs/MultilineInput';

import { setCanSave, setUserUpdated, setReloadUser } from '../../../redux/user/userSlice';
import { setShowBackdrop } from '../../../redux/backdrop/backdropSlice';
import { setDialogAlertTitle, setDialogAlertMessage, setDialogAlertButtonText, setDialogAlertOpen } from '../../../redux/dialog-alert/dialogAlertSlice';

import { getUser, updateUser } from '../../../api/user/user';
import { showAlert } from '../../../utils/AlertUtils';
import { pathnameEnum } from '../../constants/Pathname';

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
  const history = useHistory();
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
  const [passwordHelperText, setPasswordHelperText] = useState(i18n.t('common.input.confirmPasswordHelper'));
  // Boolean to disable or enable submit button
  const [canSubmit, setCanSubmit] = useState(false);
  // Boolean to show change password dialog
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  // Boolean to show delete account dialog
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);
  // Boolean to tell if passwords are matching or not
  const [passwordMatch, setPasswordMatch] = useState(false);

  // Array to build passwords inputs
  const passwords = [
    {
      label: i18n.t('views.settings.dialog.currentPassword'),
      placeholder: i18n.t('views.settings.dialog.currentPasswordPlaceholder'),
      name: fieldNames.currentPassword,
      caption: i18n.t('common.input.passwordRules')
    },
    {
      label: i18n.t('views.settings.dialog.newPassword'),
      placeholder: i18n.t('views.settings.dialog.newPasswordPlaceholder'),
      name: fieldNames.newPassword,
      caption: i18n.t('common.input.passwordRules')
    },
    {
      label: i18n.t('views.settings.dialog.confirmNewPassword'),
      placeholder: i18n.t('views.settings.dialog.confirmNewPasswordPlaceholder'),
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
        bio: data.bio ? data.bio : ''
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
    resetPasswordInputs();
		setOpenChangePasswordDialog(true);
	}

  // Close change password modal
	const closeChangePassword = () => {
		setOpenChangePasswordDialog(false);
	}

  /**
   * Validate password inputs
   */
  const validatePasswordInputs = (currentPassword, newPassword, confirmNewPassword) => {
    const letter = /[a-zA-Z]/; 
    const number = /[0-9]/;
    const specialChar = /[*@!#%&()^~{}]+/;

    const passwordValidation = currentPassword && currentPassword !== '';
    const newPasswordValidation = newPassword && newPassword !== '' && newPassword.length > 7 
      && letter.test(newPassword) && number.test(newPassword) && specialChar.test(newPassword);
    let passwordMatch  = false;
    if (confirmNewPassword && confirmNewPassword !== '') {
      passwordMatch = confirmNewPassword === newPassword;
      setPasswordHelperText(passwordMatch ? i18n.t('common.input.confirmPasswordHelperOk') : i18n.t('common.input.confirmPasswordHelper'));
      setPasswordMatch(passwordMatch);
    }
    setCanSubmit(passwordValidation && newPasswordValidation && passwordMatch);
  }

  const validateEmail = (email) => {
    const emailRegex = /.+@.+\..+/;
    return email && email !== '' && emailRegex.test(email);
  }

  // Check if a value has changed, to enable save button
  const checkValuesChanged = (inputName, value) => {
    let canSave = false;
    const newUserUpdated = { ...userUpdated }

    switch (inputName) {
      case fieldNames.email:
        newUserUpdated.email = value;
        canSave = user.email !== value && validateEmail(value);
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
        validatePasswordInputs(value, newPassword, confirmNewPassword);
        break;
      case fieldNames.newPassword:
        setNewPassword(value);
        validatePasswordInputs(currentPassword, value, confirmNewPassword);
        break;
      case fieldNames.confirmNewPassword:
        setConfirmNewPassword(value);
        validatePasswordInputs(currentPassword, newPassword, value);
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
  const getPasswordInput = (label, placeholder, name, caption) => {
    return (
      <Box key={name}>
        <InputLabel sx={{ mt: '20px' }}>{label}</InputLabel>
        <CustomInput 
          placeholder={placeholder}
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
      newPassword: newPassword
    }

    await updateUser(user.userId, dataToSend)
    .then(() => {
      setOpenChangePasswordDialog(false);
      resetPasswordInputs();
      // Show dialog success
      dispatch(setDialogAlertTitle(i18n.t('views.settings.dialog.changePassword.title')));
      dispatch(setDialogAlertMessage(i18n.t('views.settings.dialog.changePassword.success')));
      dispatch(setDialogAlertButtonText(i18n.t('common.button.done')));
      dispatch(setDialogAlertOpen(true));
    }).catch(error => {
      let message = '';
      if (error.response) {
        message = i18n.t('views.settings.dialog.changePassword.error');
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

  const handleShowBillingPage = () => {
    history.push(pathnameEnum.billing);
  }

  return (
    <Container maxWidth={false}>
      <Box sx={{ pb: 3 }}>
        <Typography variant="h5" color="#fff">{i18n.t('views.settings.account.title')}</Typography>

        <Grid container sx={{ mt: 2, width: '100%' }}>
          <Grid item xs={9} md={6} xl={4}>
            <InputLabel>{i18n.t('common.input.email')}</InputLabel>
            <CustomInput
              placeholder={i18n.t('common.input.email')}
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
          <InputLabel>{i18n.t('common.input.password')}</InputLabel>
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
              <Button variant="contained" color="secondary" fullWidth onClick={openChangePassword}>{i18n.t('common.button.change')}</Button>
            </Grid>
          </Box>
        </Grid>

        <Box sx={{ mt: 2, color: '#fff' }}>
          {i18n.t('views.settings.account.cancelAccount')}
          <Link color="#df678c" onClick={() => setOpenDeleteAccountDialog(true)}>{i18n.t('views.settings.common.clickHere')}</Link>
        </Box>

        <Typography variant="h5" color="#fff" sx={{ mt: 3 }}>{i18n.t('views.settings.personal.title')}</Typography>

        <Grid container sx={{ mt: 2, width: '100%' }}>
          <Grid item xs={9} md={6} xl={4}>
            <InputLabel>{i18n.t('common.input.name')}</InputLabel>
            <CustomInput
              placeholder={i18n.t('common.input.name')}
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
            <InputLabel>{i18n.t('views.settings.personal.shortBio')}</InputLabel>
            <MultilineInput 
              placeholder={i18n.t('views.settings.personal.shortBio')}
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

        {/* <Typography variant="h5" color="#fff" sx={{ mt: 3 }}>Notifications</Typography>

        <Box sx={{ mt: 1.5, ml: 1 }}>
          <Grid container>
            <Grid item><FormControlLabel control={<Switch defaultChecked sx={{ mr: 1 }} />} label="Video processing complete" sx={{ color: '#fff' }} /></Grid>
          </Grid>

          <Grid container sx={{ mt: 2 }}>
            <Grid item><FormControlLabel control={<Switch sx={{ mr: 1 }} />} label="Product updates" sx={{ color: '#fff' }} /></Grid>
          </Grid>
        </Box> */}

        {/* <Typography variant="h5" color="#fff" sx={{ mt: 3 }}>Billing information</Typography>

        <Box sx={{ mt: 2, color: '#fff' }}>
          {"To see invoices change credit card, VAT or address, "}
          <Link color="#df678c" onClick={() => handleShowBillingPage()}>please click here.</Link>
        </Box> */}
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
            {i18n.t('views.settings.dialog.changePassword.title')}
            </Typography>

            {passwords.map(password => getPasswordInput(password.label, password.placeholder, password.name, password.caption))}
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="secondary" fullWidth onClick={closeChangePassword}>
              {i18n.t('common.button.cancel')}
            </Button>

            <Button type="submit" disabled={!canSubmit} variant="contained" fullWidth onClick={saveChangePassword}>
              {i18n.t('views.settings.dialog.changePassword.save')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <DeleteAccount 
        open={openDeleteAccountDialog}
        close={() => setOpenDeleteAccountDialog(false)}
      />
    </Container>
  );
}
 
export default Account;