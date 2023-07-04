import React, { useState } from 'react';
import Box from '@mui/material/Box';

import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Activation from './Activation';

const componentName = {
  signup: 'signup',
  login: 'login',
  forgot: 'forgot',
  activation: 'activation'
}

const Authentication = () => {
  const [toDisplay, setToDisplay] = useState(componentName.login);
  const [email, setEmail] = useState('');

  const setSignup = () => {
    setToDisplay(componentName.signup);
  }

  const setLogin = () => {
    setToDisplay(componentName.login);
  }

  const setForgot = () => {
    setToDisplay(componentName.forgot);
  }

  const setActivation = (email) => {
    setEmail(email);
    setToDisplay(componentName.activation);
  }

  return (
    <Box height="100%" sx={{ backgroundColor: '#3c4045', display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
      {toDisplay === componentName.signup && <Signup setLogin={setLogin} setActivation={setActivation} />}
      {toDisplay === componentName.login && <Login setSignup={setSignup} setForgot={setForgot} setActivation={setActivation} />}
      {toDisplay === componentName.forgot && <ForgotPassword setLogin={setLogin} />}
      {toDisplay === componentName.activation && <Activation setLogin={setLogin} email={email} />}
    </Box>
  );
}
 
export default Authentication;