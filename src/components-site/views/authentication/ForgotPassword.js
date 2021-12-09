import React, { useState } from 'react';
import i18n from 'i18next';

import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { InputLabel } from '@mui/material';

import CustomInput from '../../inputs/CustomInput';

import { sendResetCode, checkResetCode, defineNewPassword } from '../../../api/user/user';

import { showAlert } from '../../../utils/AlertUtils';

const pageNames = {
  email: 'email',
  code: 'code',
  newpassword: 'newpassword'
}

/**
 * Forgot password page
 */
const ForgotPassword = (props) => {
  const { setLogin } = props;

  // Page name to show the right component
  const [page, setPage] = useState(pageNames.email);
  // Store inputs values
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  // Boolean to disable or enable submit buttons
  const [canSubmitEmail, setCanSubmitEmail] = useState(false);
  const [canSubmitCode, setCanSubmitCode] = useState(false);
  const [canSubmitPassword, setCanSubmitPassword] = useState(false);

  const validateInputs = (email) => {
    const emailRegex = /.+@.+\..+/;

    const emailValidation = email && email !== '' && emailRegex.test(email);
    setCanSubmitEmail(emailValidation);
  }

  const onChangeEmail = (event) => {
    const email = event.target.value;
    validateInputs(email);
    setEmail(email);
  }

  const onChangeCode = (event) => {
    const code = event.target.value;
    setCanSubmitCode(code && code !== '');
    setCode(code);
  }

  const onChangeNewPassword = (event) => {
    const letterRegex = /[a-zA-Z]/; 
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[*@!#%&()^~{}]+/;
    const newPassword = event.target.value;
    setNewPassword(newPassword);
    const passwordValidation = newPassword && newPassword !== '' && newPassword.length > 7 
      && letterRegex.test(newPassword) && numberRegex.test(newPassword) && specialCharRegex.test(newPassword);
    setCanSubmitPassword(passwordValidation);
  }

  const handleBack = () => {
    setLogin();
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();

    if (page === pageNames.email) {
      handleSubmitEmail();
    } 
    if (page === pageNames.code) {
      handleSubmitCode();
    }
    if (page === pageNames.newpassword) {
      handleSubmitNewPassword();
    }
  }

  const handleSubmitEmail = async () => {
    const dataToSend = {
      email: email
    }

    await sendResetCode(dataToSend)
      .then(() => setPage(pageNames.code))
      .catch((error) => showAlert(error.response.data.message, 'error'));
  }

  const handleSubmitCode = async () => {
    const dataToSend = {
      email: email,
      reset_code: code
    }

    await checkResetCode(dataToSend)
      .then(() => setPage(pageNames.newpassword))
      .catch((error) => showAlert(error.response.data.message, 'error'));
  }

  const handleSubmitNewPassword = async () => {
    const dataToSend = {
      email: email,
      newPassword: newPassword
    }

    await defineNewPassword(dataToSend).then(() => {
      const success = i18n.t('form.forgotPassword.success');
      showAlert(success, 'success');
      setLogin();
    });
  }

  return (
    <Box maxWidth="sm">
      <Box
        sx={{
          padding: 5,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#202427',
          boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box><img src="/images/img_mstudio.png" /></Box>

        <Typography component="h1" variant="h4" sx={{ mt: 3, fontWeight: 'normal' }}>
            {page === pageNames.email && i18n.t('form.forgotPassword.email.title')}
            {page === pageNames.code && i18n.t('form.forgotPassword.reset.title')}
            {page === pageNames.newpassword && i18n.t('form.forgotPassword.newPassword.title')}
        </Typography>

        <Typography component="h1" variant="subtitle1" sx={{ mt: 1 }}>
            {page === pageNames.email && i18n.t('form.forgotPassword.email.content')}
            {page === pageNames.code && i18n.t('form.forgotPassword.reset.content')}
            {page === pageNames.newpassword && i18n.t('form.forgotPassword.newPassword.content')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 5 }} width="100%">          
          <InputLabel required>
            {page === pageNames.email && i18n.t('common.input.email')}
            {page === pageNames.code && i18n.t('form.forgotPassword.reset.code')}
            {page === pageNames.newpassword && i18n.t('common.input.password')}
          </InputLabel>
          
          {page === pageNames.email &&
            <CustomInput 
              placeholder={i18n.t('common.input.emailPlaceholder')}
              fullWidth 
              required 
              id="email"
              type="email" 
              name="email"
              autoComplete="email"
              onChange={onChangeEmail}
              value={email}
            />
          }

          {page === pageNames.code &&
            <CustomInput 
              placeholder={i18n.t('form.forgotPassword.reset.codePlaceholder')}
              fullWidth 
              required 
              id="verification-code"
              name="verification-code"
              sx={{ mb: 1 }}
              value={code}
              onChange={onChangeCode}
            />
          }

          {page === pageNames.newpassword &&
            <Box>
              <CustomInput 
                placeholder={i18n.t('form.forgotPassword.newPassword.passwordPlaceholder')}
                fullWidth 
                required 
                id="new-password"
                name="new-password"
                type="password"
                sx={{ mb: 1 }}
                value={newPassword}
                onChange={onChangeNewPassword}
              />

              <Typography variant="caption">
                {i18n.t('common.input.passwordRules')}
              </Typography>
            </Box>
          }

          {page === pageNames.code && <Link onClick={handleSubmitCode} variant="body2" underline="hover" color="#9a9a9a">
            {i18n.t('form.forgotPassword.reset.resend')}
          </Link>}

          <Box sx={{ display: 'flex', mt: 5 }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mr: 3, px: 7 }}
              onClick={handleBack}
            >
              {i18n.t('common.button.back')}
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={(page === pageNames.email && !canSubmitEmail) || (page === pageNames.code && !canSubmitCode) || (page === pageNames.newpassword && !canSubmitPassword)}
              onClick={handleSubmit}
            >
              {page === pageNames.email && i18n.t('common.button.next')}
              {page === pageNames.code && i18n.t('form.forgotPassword.reset.verify')}
              {page === pageNames.newpassword && i18n.t('common.button.submit')}
            </Button>
          </Box>
          
          {/* {page === pageNames.email && <Box sx={{ textAlign: 'center', mt: 2, color: '#fff' }}>
            {i18n.t('form.forgotPassword.email.havingTrouble')} {" "}
            <Link color="#df678c">
              {i18n.t('form.forgotPassword.email.contactUs')}
            </Link>
          </Box>} */}
        </Box>
      </Box>
    </Box>
  );
}
 
export default ForgotPassword;