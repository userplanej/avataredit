import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import i18n from 'i18next';

import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { InputLabel } from '@mui/material';

import CustomInput from '../../inputs/CustomInput';

import { signInUser } from '../../../api/user/user';

import { showAlert } from '../../../utils/AlertUtils';

const Login = (props) => {
  const { setSignup, setForgot } = props;
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    const search = history.location.search;
    if (search && search !== '') {
      const params = search
        .slice(1)
        .split('&')
        .map(p => p.split('='))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
      
      const headers = {
        'Access-Control-Allow-Origin': 'sso.maum.ai, data.maum.ai',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      }
      axios({
        method: 'post',
        url: `https://sso.maum.ai/hq/oauth/token?grant_type=authorization_code&code=${params.code}&redirect_uri=http://localhost:4000/studio/home`,
        headers: headers
      })
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const dataToSend = {
      email: email,
      password: password
    }

    await signInUser(dataToSend)
    .then((res) => {
      const user = res.data.body;
      sessionStorage.setItem('user', JSON.stringify(user));
      history.push('/studio/home');
    })
    .catch(error => {
      let message = '';
      if (error.response) {
        message = 'Email and password are incorrect.';
      } else if (error.request) {
        message = error.request;
      } else {
        message = error;
      }
      showAlert(message, 'error');
    });
  };

  const validateInputs = (email, password) => {
    const emailRegex = /.+@.+\..+/;
    const letterRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[*@!#%&()^~{}]+/;

    const emailValidation = email && email !== '' && emailRegex.test(email);
    const passwordValidation = password && password !== '' && password.length > 7 
      && letterRegex.test(password) && numberRegex.test(password) && specialCharRegex.test(password);
    setCanSubmit(emailValidation && passwordValidation);
  }

  const onChangeEmail = (event) => {
    const newEmail = event.target.value;
    validateInputs(newEmail, password);
    setEmail(newEmail);
  }

  const onChangePassword = (event) => {
    const newPassword = event.target.value;
    validateInputs(email, newPassword);
    setPassword(newPassword);
  }

  const handleSsoLogin = () => {
    const headers = {
      'Access-Control-Allow-Origin': 'sso.maum.ai, data.maum.ai',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    }
    const url = 'https://sso.maum.ai/maum/loginMain?response_type=code&client_id=dataEditTool&redirect_uri=http://localhost:4000/login';
    axios({
      method: 'get',
      url: url,
      headers: headers
    })
    .then(res => console.log(res));
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

        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 'normal' }}>
          {i18n.t('form.login.title')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 5 }} width="100%">          
          <InputLabel required>{i18n.t('common.input.email')}</InputLabel>
          <CustomInput 
            placeholder={i18n.t('common.input.emailPlaceholder')}
            fullWidth 
            required 
            id="email"
            type="email" 
            name="email"
            autoComplete="email"
            onChange={onChangeEmail}
          />
         
          <InputLabel required sx={{ mt: '20px' }}>{i18n.t('common.input.password')}</InputLabel>
          <CustomInput 
            placeholder={i18n.t('common.input.passwordPlaceholder')}
            fullWidth 
            required 
            id="password"
            type="password" 
            name="password"
            autoComplete="current-password"
            onChange={onChangePassword}
          />

          <Typography variant="caption">
            {i18n.t('common.input.passwordRules')}
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Link onClick={setForgot} variant="body1" underline="hover" color="#fff">
              {i18n.t('form.login.forgotPassword')}
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!canSubmit}
            sx={{ mt: 5, mb: 2 }}
          >
            {i18n.t('form.login.login')}
          </Button>
          
          <Box sx={{ textAlign: 'center' }} color="#fff">
            {i18n.t('form.login.notMember')} {" "}
            <Link onClick={setSignup} color="#df678c">
              {i18n.t('form.login.joinHere')}
            </Link>
          </Box>

          {/* <Button href="https://sso.maum.ai/maum/loginMain?response_type=code&client_id=dataEditTool&redirect_uri=http://localhost:4000/login">Maum SSO</Button> */}
        </Box>
      </Box>
    </Box>
  );
}

export default Login;