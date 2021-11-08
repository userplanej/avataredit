import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { InputLabel } from '@mui/material';
import CustomInput from '../../inputs/CustomInput';

/**
 * Forgot password page
 */
const ForgotPassword = (props) => {
  const { setLogin } = props;

  // Boolean to show Code verification component if true, else show Email input component
  const [isVerify, setIsVerify] = useState(false);
  // Store inputs values
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  // Boolean to disable or enable submit buttons
  const [canSubmitEmail, setCanSubmitEmail] = useState(false);
  const [canSubmitCode, setCanSubmitCode] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email')
    });

    setIsVerify(true);
  };

  const onChangeEmail = (event) => {
    const email = event.target.value;
    setCanSubmitEmail(email && email !== '');
    setEmail(email);
  }

  const onChangeCode = (event) => {
    const code = event.target.value;
    setCanSubmitCode(code && code !== '');
    setCode(code);
  }

  const handleBack = () => {
    if (isVerify) {
      setIsVerify(false);
    } else {
      setLogin();
    }
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

        <Typography component="h1" variant="h4" sx={{ mt: 3, fontWeight: 'normal' }}>
          {isVerify ? 'Reset password' : 'Can\'t log in?'}
        </Typography>

        <Typography component="h1" variant="subtitle1" sx={{ mt: 1 }}>
          {isVerify ? 'Enter the code sent to your email' : 'Type your email so we can send you a password recovery email'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 5 }} width="100%">          
          <InputLabel required>{isVerify ? 'Verification code' : 'Email'}</InputLabel>
          {isVerify ?
          <CustomInput 
            placeholder="Type your verification code" 
            fullWidth 
            required 
            id="verification-code"
            name="verification-code"
            type="password"
            sx={{ mb: 1 }}
            value={code}
            onChange={onChangeCode}
          />
          :
          <CustomInput 
            placeholder="Type your email" 
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

          {isVerify && <Link href="#" variant="body2" underline="hover">
            {"Resend code"}
          </Link>}

          <Box sx={{ display: 'flex', mt: 5 }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mr: 3, px: 7 }}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={(!isVerify && !canSubmitEmail) || (isVerify && !canSubmitCode)}
            >
              {isVerify ? 'Verify' : 'Next'}
            </Button>
          </Box>
          
          {!isVerify && <Box sx={{ textAlign: 'center', mt: 2 }}>
            Still having trouble? {" "}
            <Link color="#df678c">
              Contact us at
            </Link>
          </Box>}
        </Box>
      </Box>
    </Container>
  );
}
 
export default ForgotPassword;