import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { InputLabel } from '@mui/material';
import CustomInput from '../../inputs/CustomInput';

const Login = (props) => {
  const { setSignup, setForgot } = props;
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });
    history.push('/studio/home');
  };

  const validateInputs = (email, password) => {
    let letter = /[a-zA-Z]/; 
    let number = /[0-9]/;

    const emailValidation = email && email !== '';
    const passwordValidation = password && password !== '' && password.length > 7 && letter.test(password) && number.test(password);
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

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          padding: 5,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          boxShadow: '4px 6px 6px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box display="flex">
          <Typography component="h1" variant="h4" color="#df678c">Minds</Typography>
          <Typography component="h1" variant="h4" color="#09113c">lab</Typography>
        </Box>

        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 'normal' }}>
          Welcome back
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 5 }} width="100%">          
          <InputLabel required>Email</InputLabel>
          <CustomInput 
            placeholder="Type your email" 
            fullWidth 
            required 
            id="email"
            type="email" 
            name="email"
            autoComplete="email"
            onChange={onChangeEmail}
          />
         
          <InputLabel required sx={{ mt: '20px' }}>Password</InputLabel>
          <CustomInput 
            placeholder="Type your password" 
            fullWidth 
            required 
            id="password"
            type="password" 
            name="password"
            autoComplete="current-password"
            onChange={onChangePassword}
          />

          <Typography variant="caption">
            Password must contain more than 8 characters and includes both alphabetical and numerical
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Link onClick={setForgot} variant="body1" underline="hover" color="#4f4081">
              Forgot your password?
            </Link>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!canSubmit}
            sx={{ mt: 5, mb: 2 }}
          >
            Login
          </Button>
          
          <Box sx={{ textAlign: 'center' }} color="#4f4081">
            Not a member? {" "}
            <Link onClick={setSignup} color="#df678c">
              Join here
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;