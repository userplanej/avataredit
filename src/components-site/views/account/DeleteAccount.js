import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import i18n from 'i18next';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, InputLabel, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import CustomInput from '../../inputs/CustomInput';

import { showAlert } from '../../../utils/AlertUtils';

import { deleteUser } from '../../../api/user/user';

import { pathnameEnum } from '../../constants/Pathname';

const listDeleteReasons = [
  i18n.t('views.settings.dialog.cancelAccount.reasons.reason1'),
  i18n.t('views.settings.dialog.cancelAccount.reasons.reason2'),
  i18n.t('views.settings.dialog.cancelAccount.reasons.reason3'),
  i18n.t('views.settings.dialog.cancelAccount.reasons.reason4'),
  i18n.t('views.settings.dialog.cancelAccount.reasons.reason5'),
  i18n.t('views.settings.dialog.cancelAccount.reasons.reason6')
]

const DeleteAccount = (props) => {
  const {
    open,
    close
  } = props;
  const history = useHistory();

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
      const message = i18n.t('views.settings.dialog.cancelAccount.error');
      showAlert(message, 'error');
    }
  }

  const handleBackToEnterEmail = () => {
    setShowEnterEmail(true);
  }

  const handleCloseFinalPage = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    await deleteUser(user.user_id).then(() => {
      close();
      sessionStorage.removeItem('user');
      history.push(pathnameEnum.login);
    });
  }

  const getEnterEmail = () => {
    return (
      <Box component="form" onSubmit={handleSubmitEmail} noValidate width="100%">
        <DialogTitle id="delete-account-dialog-title" sx={{ textAlign: 'right' }}>
          <CloseIcon fontSize="large" onClick={close} sx={{ cursor: 'pointer', color: '#fff' }} />
        </DialogTitle>

        <DialogContent>
          <Typography variant="h5" color="#fff">
            {i18n.t('views.settings.dialog.cancelAccount.title')}
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 4 }}>
            {i18n.t('views.settings.dialog.cancelAccount.content')}
          </Typography>

          <InputLabel>{i18n.t('common.input.email')}</InputLabel>
          <CustomInput
            placeholder={i18n.t('common.input.emailPlaceholder')}
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
            {i18n.t('common.button.cancel')}
          </Button>

          <Button type="submit" disabled={!canSubmit} variant="contained" fullWidth onClick={handleSubmitEmail}>
            {i18n.t('common.button.next')}
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
            {i18n.t('views.settings.dialog.cancelAccount.reasons.title')}
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
            {i18n.t('common.button.back')}
          </Button>

          <Button type="submit" disabled={!canSubmit} variant="contained" fullWidth onClick={() => setShowFinalPage(true)}>
            {i18n.t('common.button.next')}
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
            {i18n.t('views.settings.dialog.cancelAccount.success.title')}
          </Typography>
          
          <Typography variant="subtitle1">
            {i18n.t('views.settings.dialog.cancelAccount.success.content')}
          </Typography>

          <Typography variant="subtitle1" mt={4}>
            {i18n.t('views.settings.dialog.cancelAccount.success.seeyou')}
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