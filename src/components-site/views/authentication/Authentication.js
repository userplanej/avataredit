import React, { useState } from 'react';
import Box from '@mui/material/Box';

import Signup from './Signup';
import Login from './Login';
import ForgotPassword from './ForgotPassword';

const componentName = {
  signup: 'signup',
  login: 'login',
  forgot: 'forgot'
}

const Authentication = () => {
  const [toDisplay, setToDisplay] = useState(componentName.login);

  const setSignup = () => {
    setToDisplay(componentName.signup);
  }

  const setLogin = () => {
    setToDisplay(componentName.login);
  }

  const setForgot = () => {
    setToDisplay(componentName.forgot);
  }

  return (
    <Box height="100%" sx={{ backgroundColor: '#3c4045', display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
      {toDisplay === componentName.signup && <Signup setLogin={setLogin} />}
      {toDisplay === componentName.login && <Login setSignup={setSignup} setForgot={setForgot} />}
      {toDisplay === componentName.forgot && <ForgotPassword setLogin={setLogin} />}
    </Box>
  );
}
 
export default Authentication;