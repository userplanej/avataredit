import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18next';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { InputLabel } from '@mui/material';

import CustomInput from '../../../inputs/CustomInput';

import { setName, setEmail, setPassword, setConfirmPassword } from '../../../../redux/form/signupSlice';

/**
 * Signup form: personal informations page
 */
const Personal = (props) => {
  const { setLogin, setCompany } = props;

  const dispatch = useDispatch();
  // Inputs values
  const name = useSelector(state => state.signup.name);
  const email = useSelector(state => state.signup.email);
  const password = useSelector(state => state.signup.password);
  const confirmPassword = useSelector(state => state.signup.confirmPassword);
  // Inputs helper text
  const [passwordHelperText, setPasswordHelperText] = useState(i18n.t('common.input.confirmPasswordHelper'));
  // Boolean to tell if passwords are matching or not
  const [passwordMatch, setPasswordMatch] = useState(false);
  // Boolean to disable or enable confirm button
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    // When getting back to this page, we need to validate inputs again
    validateInputs(name, email, password, confirmPassword);
  }, []);
  
  /**
   * Validate all inputs of this page, in particular password rules and password matching
   */
  const validateInputs = (name, email, password, confirmPassword) => {
    const emailRegex = /.+@.+\..+/;
    const letterRegex = /[a-zA-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[*@!#%&()^~{}]+/;

    const nameValidation = name && name !== '';
    const emailValidation = email && email !== '' && emailRegex.test(email);
    const passwordValidation = password && password !== '' && password.length > 7
      && letterRegex.test(password) && numberRegex.test(password) && specialCharRegex.test(password);
    let passwordMatch  = false;
    if (confirmPassword && confirmPassword !== '') {
      passwordMatch = confirmPassword === password;
      setPasswordHelperText(passwordMatch ? i18n.t('common.input.confirmPasswordHelperOk') : i18n.t('common.input.confirmPasswordHelper'));
      setPasswordMatch(passwordMatch);
    }
    setCanSubmit(nameValidation && emailValidation && passwordValidation && passwordMatch);
  }

  const onChangeValue = (inputName, value) => {
    switch (inputName) {
      case 'name':
        dispatch(setName(value));
        validateInputs(value, email, password, confirmPassword);
        break;
      case 'email':
        dispatch(setEmail(value));
        validateInputs(name, value, password, confirmPassword);
        break;
      case 'password':
        dispatch(setPassword(value));
        validateInputs(name, email, value, confirmPassword);
        break;
      case 'confirmPassword':
        dispatch(setConfirmPassword(value));
        validateInputs(name, email, password, value);
        break;
      default:
        break;
    }
  }

  /**
   * Set the color of password text helper displayed below the confirm password input
   */
  const getColorPasswordHelper = () => {
    if (confirmPassword !== '') {
      return passwordMatch ? 'green' : 'error';
    }
    return null;
  }

  /**
   * Used to handle pressing enter to go to the next step
   */
  const handleLocalSubmit = (event) => {
    event.preventDefault();
    validateInputs(name, email, password, confirmPassword);
  }

  return (
    <Box component="form" noValidate onSubmit={handleLocalSubmit}>
      <InputLabel required sx={{ mt: '20px' }}>{i18n.t('common.input.name')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('common.input.namePlaceholder')}
        fullWidth
        required
        id="name"
        name="name"
        value={name}
        onChange={(event) => onChangeValue('name', event.target.value)}
      />
      
      <InputLabel required sx={{ mt: '20px' }}>{i18n.t('common.input.email')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('common.input.emailPlaceholder')}
        fullWidth
        required
        id="email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(event) => onChangeValue('email', event.target.value)}
      />

      <InputLabel required sx={{ mt: '20px' }}>{i18n.t('common.input.password')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('common.input.passwordPlaceholder')}
        fullWidth
        required
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(event) => onChangeValue('password', event.target.value)}
      />

      <Typography variant="caption">
        {i18n.t('common.input.passwordRules')}
      </Typography>
      
      <InputLabel required sx={{ mt: '20px' }}>{i18n.t('common.input.confirmPassword')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('common.input.confirmPasswordPlaceholder')}
        fullWidth
        required
        type="password"
        id="confirm-password"
        name="confirm-password"
        value={confirmPassword}
        onChange={(event) => onChangeValue('confirmPassword', event.target.value)}
      />

      <Typography variant="caption" color={getColorPasswordHelper()}>
        {passwordHelperText}
      </Typography>
        
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 6, mb: 2 }}
        onClick={setCompany}
        disabled={!canSubmit}
        type="submit"
      >
        {i18n.t('common.button.continue')}
      </Button>

      <Box sx={{ textAlign: 'center' }} color="#fff">
        {i18n.t('form.signup.personal.alreadyMember')} {" "}
        <Link onClick={setLogin} color="#df678c">
          {i18n.t('form.signup.personal.loginHere')}
        </Link>
      </Box>
    </Box>
  );
}
 
export default Personal;