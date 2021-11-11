import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { InputLabel } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import CustomInput from '../../../inputs/CustomInput';

import { setPaymentEmail, setCardNumber, setCardDate, setCardCode, setCardName, setPaymentCountry } from '../../../../redux/form/signupSlice';

/**
 * Signup form: payment informations page
 */
const Payment = (props) => {
  const { setQuestions, handleSubmit } = props;

  const dispatch = useDispatch();
  // Inputs values
  const paymentEmail = useSelector(state => state.signup.paymentEmail);
  const cardNumber = useSelector(state => state.signup.cardNumber);
  const cardDate = useSelector(state => state.signup.cardDate);
  const cardCode = useSelector(state => state.signup.cardCode);
  const cardName = useSelector(state => state.signup.cardName);
  const paymentCountry = useSelector(state => state.signup.paymentCountry);
  // Boolean to save card informations or not
  const [saveCardInfo, setSaveCardInfo] = useState(false);
  // Boolean to disable or enable confirm button
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    // When getting back to this page, we need to validate inputs again
    validateInputs(paymentEmail, cardNumber, cardDate, cardCode, cardName, paymentCountry);
  }, []);
  
  /**
   * Validate all inputs of this page
   */
  const validateInputs = (paymentEmail, cardNumber, cardDate, cardCode, cardName, paymentCountry) => {
    const paymentEmailValidation = paymentEmail && paymentEmail !== '';
    const cardNumberValidation = cardNumber && cardNumber !== '';
    const cardDateValidation = cardDate && cardDate !== '';
    const cardCodeValidation = cardCode && cardCode !== '';
    const cardNameValidation = cardName && cardName !== '';
    const paymentCountryValidation = paymentCountry && paymentCountry !== '';
    
    setCanSubmit(paymentEmailValidation && cardNumberValidation && cardDateValidation && cardCodeValidation && cardNameValidation && paymentCountryValidation);
  }

  const onChangeValue = (inputName, value) => {
    switch (inputName) {
      case 'paymentEmail':
        dispatch(setPaymentEmail(value));
        validateInputs(value, cardNumber, cardDate, cardCode, cardName, paymentCountry);
        break;
      case 'cardNumber':
        dispatch(setCardNumber(value));
        validateInputs(paymentEmail, value, cardDate, cardCode, cardName, paymentCountry);
        break;
      case 'cardDate':
        dispatch(setCardDate(value));
        validateInputs(paymentEmail, cardNumber, value, cardCode, cardName, paymentCountry);
        break;
      case 'cardCode':
        dispatch(setCardCode(value));
        validateInputs(paymentEmail, cardNumber, cardDate, value, cardName, paymentCountry);
        break;
      case 'cardName':
        dispatch(setCardName(value));
        validateInputs(paymentEmail, cardNumber, cardDate, cardCode, value, paymentCountry);
        break;
      case 'paymentCountry':
        dispatch(setPaymentCountry(value));
        validateInputs(paymentEmail, cardNumber, cardDate, cardCode, cardName, value);
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
    validateInputs(paymentEmail, cardNumber, cardDate, cardCode, cardName, paymentCountry);
  }

  return (
    <Box component="form" noValidate onSubmit={handleLocalSubmit}>
      <Typography component="h1" variant="h5">
       Payment
      </Typography>

      <InputLabel sx={{ mt: 4 }}>Email</InputLabel>
      <CustomInput 
        placeholder="Type your email" 
        fullWidth  
        id="paymentEmail"
        name="paymentEmail"
        value={paymentEmail}
        onChange={(event) => onChangeValue('paymentEmail', event.target.value)}
      />

      <InputLabel sx={{ mt: 2 }}>Card Information</InputLabel>
      <CustomInput 
        placeholder="Eg - 876492329384" 
        fullWidth  
        id="cardNumber"
        name="cardNumber"
        value={cardNumber}
        onChange={(event) => onChangeValue('cardNumber', event.target.value)}
      />
      <Box sx={{ display: 'flex' }}>
        <CustomInput 
          placeholder="MM/YY" 
          fullWidth  
          id="cardDate"
          name="cardDate"
          value={cardDate}
          onChange={(event) => onChangeValue('cardDate', event.target.value)}
        />
        <CustomInput 
          placeholder="CVV" 
          fullWidth  
          id="cardCode"
          name="cardCode"
          value={cardCode}
          onChange={(event) => onChangeValue('cardCode', event.target.value)}
        />
      </Box>
      
      <InputLabel sx={{ mt: 2 }}>Name on card</InputLabel>
      <CustomInput 
        placeholder="Your name on card" 
        fullWidth  
        id="cardName"
        name="cardName"
        value={cardName}
        onChange={(event) => onChangeValue('cardName', event.target.value)}
      />

      <InputLabel sx={{ mt: 2 }}>Country or region</InputLabel>
      <CustomInput 
        placeholder="Your country or region" 
        fullWidth  
        id="paymentCountry"
        name="paymentCountry"
        value={paymentCountry}
        onChange={(event) => onChangeValue('paymentCountry', event.target.value)}
      />

      <FormControlLabel 
        sx={{ mt: 2, color: '#9a9a9a' }}
        control={<Checkbox value={saveCardInfo} onChange={() => setSaveCardInfo(!saveCardInfo)} sx={{ '& .MuiSvgIcon-root': { fontSize: 30, color: '#fff' } }} />} 
        label="Save card info for next billing" 
      />
        
      <Typography variant="body2" mt={1}>
        By confirming your subscription, you allow M Studio to charge your card for this payment and future payments in accordance with their terms
      </Typography>

      <Box sx={{ display: 'flex', mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mr: 3 }}
          onClick={setQuestions}
        >
          Back
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
          type="submit"
        >
          Subscribe
        </Button>
      </Box>
    </Box>
  );
}
 
export default Payment;