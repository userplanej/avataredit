import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Personal from './signup/Personal';
import Company from './signup/Company';
import Questions from './signup/Questions';
import Payment from './signup/Payment';

import { setInitialState } from '../../../redux/form/signupSlice';
import { postUser } from '../../../api/user/user';
import { showAlert } from '../../../utils/AlertUtils';

const componentName = {
  personal: 'personal',
  company: 'company',
  questions: 'questions',
  payment: 'payment'
}

const Signup = (props) => {
  const { setLogin } = props;
  const dispatch = useDispatch();
  const signupData = useSelector(state => state.signup);

  const [toDisplay, setToDisplay] = useState(componentName.personal);

  useLayoutEffect(() => {
    // Reset values of every signup inputs
    dispatch(setInitialState());
  }, []);

  // Manage submit form to create an account
  const handleSubmit = async (event) => {    
    const dataToSend = {
      name: signupData.name,
      email: signupData.email,
      password: signupData.password,
      password_confirm: signupData.confirmPassword,
      company: signupData.company
    }
     
    await postUser(dataToSend)
    .then(() => {
      showAlert('Your account has been created.', 'success');
      setLogin();
    })
    .catch((error) => {
      let message = '';
      if (error.response) {
        message = error.response.data.message;
      } else if (error.request) {
        message = error.request;
      } else {
        message = 'An error occured while trying to create the account.'
      }
      showAlert(message, 'error');
    });
  };

  // Display "Personal informations" page
  const setPersonal = () => {
    setToDisplay(componentName.personal);
  }

  // Display "Company informations" page
  const setCompany = () => {
    setToDisplay(componentName.company);
  }
  
  // Display "Optional questions" page
  const setQuestions = () => {
    setToDisplay(componentName.questions);
  }

  // Display "Payment informations" page
  const setPayment = () => {
    setToDisplay(componentName.payment);
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

        <Typography component="h1" variant="h4" sx={{ mt: 1, fontWeight: 'normal' }}>
          Create an account
        </Typography>

        <Box sx={{ mt: 2 }} width="100%">
          {toDisplay === componentName.personal && <Personal setLogin={setLogin} setCompany={setCompany} />}
          {toDisplay === componentName.company && <Company setPersonal={setPersonal} setQuestions={setQuestions} />}
          {toDisplay === componentName.questions && <Questions setCompany={setCompany} setPayment={setPayment} />}
          {toDisplay === componentName.payment && <Payment setQuestions={setQuestions} handleSubmit={handleSubmit} />}
        </Box>
      </Box>
    </Box>
  );
}
 
export default Signup;