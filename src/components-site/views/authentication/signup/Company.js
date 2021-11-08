import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  // Boolean to disable or enable confirm button if T&C are checked or not
  const [tc, setTc] = useState(false);

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
        break;
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
        Company information (optional)
      </Typography>

      <InputLabel sx={{ mt: 4 }}>Company name</InputLabel>
      <CustomInput 
        placeholder="Type your company name" 
        fullWidth  
        id="company"
        name="company"
        value={company}
        onChange={(event) => onChangeValue('company', event.target.value)}
      />

      <InputLabel sx={{ mt: 2 }}>Billing address</InputLabel>
      <CustomInput 
        placeholder="Type your billing address" 
        fullWidth  
        id="billing-address"
        name="billing-address"
        value={billingAddress}
        onChange={(event) => onChangeValue('billingAddress', event.target.value)}
      />
      
      <InputLabel sx={{ mt: 2 }}>Vat number</InputLabel>
      <CustomInput 
        placeholder="Type your vat number (eg - GB2803414523)" 
        fullWidth  
        id="vat"
        name="vat"
        value={vat}
        onChange={(event) => onChangeValue('vat', event.target.value)}
      />
        
      <Typography variant="body2" mt={4}>
        Lorem Ipsum Lorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem IpsumLorem 
        Lorem IpsumLorem IpsumLorem IpsumIpsumLorem IpsumLorem Ipsum
      </Typography>

      <FormControlLabel control={<Checkbox value={tc} onChange={(event) => setTc(!tc)} sx={{ '& .MuiSvgIcon-root': { fontSize: 30 }, mr: '5px' }} />} label="Agree to T&C" />

      <Box sx={{ display: 'flex', mt: 5 }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mr: 3 }}
          fullWidth
          onClick={setPersonal}
        >
          Back
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={setQuestions}
          disabled={!tc}
          type="submit"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
 
export default Company;