import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18next';
import validate from 'validate-vat';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { InputLabel } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import CustomInput from '../../../inputs/CustomInput';

import { setCompany, setBillingAddress, setVat } from '../../../../redux/form/signupSlice';

/**
 * Signup form: company informations page
 */
const Company = (props) => {
  const { setPersonal, setQuestions } = props;

  const dispatch = useDispatch();
  // Inputs values
  const company = useSelector(state => state.signup.company);
  const billingAddress = useSelector(state => state.signup.billingAddress);
  const vat = useSelector(state => state.signup.vat);

  // Inputs error
  const [vatError, setVatError] = useState('');
  // Boolean to know if T&C are checked or not
  const [tc, setTc] = useState(false);
  // Boolean to disable or enable confirm button
  const [canSubmit, setCanSubmit] = useState(false);

  /**
   * Validate all inputs of this page
   */
  const validateInputs = (vat, tc) => {
    const vatValidation = vat === '' || (vat !== '' && vat.length < 16);
    setVatError(vatValidation ? '' : i18n.t('form.signup.company.errors.vat'));
    setCanSubmit(vatValidation && tc);
  }

  const onChangeValue = (inputName, value) => {
    switch (inputName) {
      case 'company':
        dispatch(setCompany(value));
        break;
      case 'billingAddress':
        dispatch(setBillingAddress(value));
        break;
      case 'vat':
        dispatch(setVat(value));
        validateInputs(value, tc);
        break;
      case 'tc':
        setTc(value);
        validateInputs(vat, value);
      default:
        break;
    }
  }

  /**
   * Used to handle pressing enter to go to the next step
   */
   const handleLocalSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <Box component="form" noValidate onSubmit={handleLocalSubmit}>
      <Typography component="h1" variant="h5">
        {i18n.t('form.signup.company.title')}
      </Typography>

      <InputLabel sx={{ mt: 4 }}>{i18n.t('form.signup.company.name')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('form.signup.company.namePlaceholder')}
        fullWidth
        id="company"
        name="company"
        value={company}
        onChange={(event) => onChangeValue('company', event.target.value)}
      />

      <InputLabel sx={{ mt: 2 }}>{i18n.t('form.signup.company.billingAddress')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('form.signup.company.billingAddressPlaceholder')}
        fullWidth
        id="billing-address"
        name="billing-address"
        value={billingAddress}
        onChange={(event) => onChangeValue('billingAddress', event.target.value)}
      />
      
      <InputLabel sx={{ mt: 2 }}>{i18n.t('form.signup.company.vat')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('form.signup.company.vatPlaceholder')}
        fullWidth
        id="vat"
        name="vat"
        value={vat}
        onChange={(event) => onChangeValue('vat', event.target.value)}
      />
      <Typography variant="caption" color="error">
        {vatError}
      </Typography>
        
      <Typography variant="body2" mt={4}>
        {i18n.t('form.signup.company.tc')}
      </Typography>

      <FormControlLabel
        sx={{ color: "#9a9a9a" }}
        control={<Checkbox value={tc} onChange={(event) => onChangeValue('tc', !tc)} sx={{ '& .MuiSvgIcon-root': { fontSize: 30 }, mr: '5px', color: '#fff' }} />}
        label={i18n.t('form.signup.company.tcAgreement')}
      />

      <Box sx={{ display: 'flex', mt: 5 }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mr: 3 }}
          fullWidth
          onClick={setPersonal}
        >
          {i18n.t('common.button.back')}
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={setQuestions}
          disabled={!canSubmit}
          type="submit"
        >
          {i18n.t('common.button.next')}
        </Button>
      </Box>
    </Box>
  );
}
 
export default Company;