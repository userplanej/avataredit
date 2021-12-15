import React, { useState } from 'react';
import i18n from 'i18next';

import { Box } from '@mui/system';
import { Typography, Button, InputLabel } from '@mui/material';

import CustomInput from '../../inputs/CustomInput';

import { checkCode } from '../../../api/user/user';

import { showAlert } from '../../../utils/AlertUtils';

const Activation = (props) => {
  const { setLogin, email } = props;

  const [code, setCode] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  const onChangeCode = (event) => {
    const code = event.target.value;
    setCanSubmit(code && code !== '');
    setCode(code);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const dataToSend = {
      email: email,
      activation_code: code
    }

    await checkCode(dataToSend)
      .then(() => {
        showAlert('Your account has been activated.', 'success');
        setLogin();
      })
      .catch((error) => showAlert(error.response.data.message, 'error'));
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
          Activate your account
        </Typography>

        <Typography component="h1" variant="subtitle1" sx={{ mt: 1 }}>
          We have sent you an email with an activation code. Please type the code in order to activate your account.
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }} width="100%">
          <InputLabel required>Email</InputLabel>
          <CustomInput
            disabled
            fullWidth
            id="email"
            name="email"
            sx={{ mb: 1 }}
            value={email}
          />

          <InputLabel required>Activation code</InputLabel>
          <CustomInput 
            placeholder="Your activation code"
            fullWidth 
            required 
            id="activation-code"
            name="activation-code"
            sx={{ mb: 1 }}
            value={code}
            onChange={onChangeCode}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!canSubmit}
            sx={{ mt: 5, mb: 2 }}
          >
            {i18n.t('common.button.submit')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
 
export default Activation;