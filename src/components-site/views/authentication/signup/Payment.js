import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { countries } from 'countries-list';
import i18n from 'i18next';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { InputLabel } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import CustomInput from '../../../inputs/CustomInput';
import SelectInput from '../../../inputs/SelectInput';

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

  // Errors
  const [cardNumberError, setCardNumberError] = useState('');
  const [cardDateError, setCardDateError] = useState('');
  const [cardCodeError, setCardCodeError] = useState('');
  // Boolean to save card informations or not
  const [saveCardInfo, setSaveCardInfo] = useState(false);
  // Boolean to disable or enable confirm button
  const [canSubmit, setCanSubmit] = useState(false);
  const [countriesList, setCountriesList] = useState([]);

  useEffect(() => {
    const countriesData = Object.keys(countries).map((key) => ({ label: countries[key].name, value: key }));
    countriesData.sort((a, b) => a.label.localeCompare(b.label));
    setCountriesList(countriesData);

    // When getting back to this page, we need to validate inputs again
    validateInputs(paymentEmail, cardNumber, cardDate, cardCode, cardName, paymentCountry);
  }, []);
  
  /**
   * Validate all inputs of this page
   */
  const validateInputs = (paymentEmail, cardNumber, cardDate, cardCode, cardName, paymentCountry) => {
    const emailRegex = /.+@.+\..+/;

    const paymentEmailValidation = paymentEmail && paymentEmail !== '' && emailRegex.test(paymentEmail);
    const cardNumberValidation = cardNumber && cardNumber !== '' && validateCardNumber(cardNumber);
    const cardDateValidation = cardDate && cardDate !== '' && validateCardDate(cardDate);
    const cardCodeValidation = cardCode && cardCode !== '' && validateCardCode(cardCode);
    const cardNameValidation = cardName && cardName !== '';
    const paymentCountryValidation = paymentCountry && paymentCountry !== '';

    setCanSubmit(paymentEmailValidation && cardNumberValidation && cardDateValidation && cardCodeValidation && cardNameValidation && paymentCountryValidation);
  }

  const validateCardNumber = (cardNumber) => {
    const isValid = (cardNumber && checkLuhn(cardNumber) &&
      cardNumber.length == 16 && (cardNumber[0] == 4 || cardNumber[0] == 5 && cardNumber[1] >= 1 && cardNumber[1] <= 5 ||
      (cardNumber.indexOf("6011") == 0 || cardNumber.indexOf("65") == 0)) ||
      cardNumber.length == 15 && (cardNumber.indexOf("34") == 0 || cardNumber.indexOf("37") == 0) ||
      cardNumber.length == 13 && cardNumber[0] == 4);

    if (!isValid) {
      setCardNumberError(i18n.t('form.signup.payment.errors.cardNumber'));
    } else {
      setCardNumberError("");
    }

    return isValid;
  }

  const validateCardDate = (cardDate) => {
    if (!cardDate.match(/(0[1-9]|1[0-2])[/][0-9]{2}/)) {
      setCardDateError(i18n.t('form.signup.payment.errors.cardDate'));
      return false;
    }

    var d = new Date();
    var currentYear = d.getFullYear();
    var currentMonth = d.getMonth() + 1;

    var cardDateSplit = cardDate.split('/');
    var year = parseInt(cardDateSplit[1], 10) + 2000;
    var month = parseInt(cardDateSplit[0], 10);

    const isExpired = year < currentYear || (year == currentYear && month < currentMonth);
    if (isExpired) {
      setCardDateError(i18n.t('form.signup.payment.errors.cardExpired'));
    } else {
      setCardDateError("");
    }

    return !isExpired;
  }

  const validateCardCode = (cardCode) => {
    const isValid = cardCode.match(/^[0-9]{3}$/);
    if (isValid) {
      setCardCodeError("");
    } else {
      setCardCodeError(i18n.t('form.signup.payment.errors.cardCode'));
    }
    return isValid;
  }

  const checkLuhn = (cardNo) => {
    var s = 0;
    var doubleDigit = false;
    for (var i = cardNo.length - 1; i >= 0; i--) {
        var digit = +cardNo[i];
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        s += digit;
        doubleDigit = !doubleDigit;
    }
    return s % 10 == 0;
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
        {i18n.t('form.signup.payment.title')}
      </Typography>

      <InputLabel sx={{ mt: 4 }}>{i18n.t('common.input.email')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('common.input.emailPlaceholder')}
        fullWidth
        id="paymentEmail"
        name="paymentEmail"
        value={paymentEmail}
        onChange={(event) => onChangeValue('paymentEmail', event.target.value)}
      />

      <InputLabel sx={{ mt: 2 }}>{i18n.t('form.signup.payment.cardInfo')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('form.signup.payment.cardInfoPlaceholder1')}
        fullWidth
        id="cardNumber" 
        name="cardNumber"
        value={cardNumber}
        onChange={(event) => onChangeValue('cardNumber', event.target.value)}
      />
      <Box sx={{ display: 'flex' }}>
        <CustomInput
          placeholder={i18n.t('form.signup.payment.cardInfoPlaceholder2')}
          fullWidth
          id="cardDate"
          name="cardDate"
          value={cardDate}
          onChange={(event) => onChangeValue('cardDate', event.target.value)}
        />
        <CustomInput
          placeholder={i18n.t('form.signup.payment.cardInfoPlaceholder3')}
          fullWidth
          id="cardCode"
          name="cardCode"
          value={cardCode}
          onChange={(event) => onChangeValue('cardCode', event.target.value)}
        />
      </Box>
      <Typography variant="caption" color="red">
        <Box>{cardNumberError}</Box>
        <Box>{cardDateError}</Box>
        <Box>{cardCodeError}</Box>
      </Typography>
      
      <InputLabel sx={{ mt: 2 }}>{i18n.t('form.signup.payment.cardName')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('form.signup.payment.cardNamePlaceholder')}
        fullWidth
        id="cardName"
        name="cardName"
        value={cardName}
        onChange={(event) => onChangeValue('cardName', event.target.value)}
      />

      <InputLabel sx={{ mt: 2 }}>{i18n.t('form.signup.payment.country')}</InputLabel>
      <SelectInput
        items={countriesList}
        id="paymentCountry"
        name="paymentCountry"
        value={paymentCountry}
        onChange={(event) => onChangeValue('paymentCountry', event.target.value)}
      />

      <FormControlLabel 
        sx={{ mt: 2, color: '#9a9a9a' }}
        control={<Checkbox value={saveCardInfo} onChange={() => setSaveCardInfo(!saveCardInfo)} sx={{ '& .MuiSvgIcon-root': { fontSize: 30, color: '#fff' } }} />} 
        label={i18n.t('form.signup.payment.saveCard')}
      />
        
      <Typography variant="body2" mt={1}>{i18n.t('form.signup.payment.terms')}</Typography>

      <Box sx={{ display: 'flex', mt: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mr: 3 }}
          onClick={setQuestions}
        >
          {i18n.t('common.button.back')}
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
          type="submit"
        >
          {i18n.t('form.signup.payment.suscribe')}
        </Button>
      </Box>
    </Box>
  );
}
 
export default Payment;