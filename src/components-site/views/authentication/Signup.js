import React, { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Personal from './signup/Personal';
import Company from './signup/Company';
import Questions from './signup/Questions';
import Payment from './signup/Payment';

import { setInitialState } from '../../../redux/form/signupSlice';

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
    dispatch(setInitialState());
  }, []);

  const handleSubmit = (event) => {
    console.log(signupData)
  };

  const setPersonal = () => {
    setToDisplay(componentName.personal);
  }

  const setCompany = () => {
    setToDisplay(componentName.company);
  }
  
  const setQuestions = () => {
    setToDisplay(componentName.questions);
  }

  const setPayment = () => {
    setToDisplay(componentName.payment);
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
    </Container>
  );
}
 
export default Signup;