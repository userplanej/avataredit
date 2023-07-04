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
        showAlert(i18n.t('form.activation.success'), 'success');
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
          {i18n.t('form.activation.title')}
        </Typography>

        <Typography component="h1" variant="subtitle1" sx={{ mt: 1 }}>
          {i18n.t('form.activation.content')}
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }} width="100%">
          <InputLabel required>{i18n.t('common.input.email')}</InputLabel>
          <CustomInput
            disabled
            fullWidth
            id="email"
            name="email"
            sx={{ mb: 1 }}
            value={email}
          />

          <InputLabel required>{i18n.t('form.activation.code')}</InputLabel>
          <CustomInput 
            placeholder={i18n.t('form.activation.codePlaceholder')}
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