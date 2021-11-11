import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { InputLabel } from '@mui/material';

import CustomInput from '../../../inputs/CustomInput';
import SelectInput from '../../../inputs/SelectInput';

import { setKnowAbout, setUseCase, setCompanySize, setApiInterested } from '../../../../redux/form/signupSlice';

// Values used in company size's select input
const companySizeValues = [
  {
    value: 1,
    label: '1-10 employees'
  },
  {
    value: 2,
    label: '11-50 employees'
  },
  {
    value: 3,
    label: '51-200 employees'
  },
  {
    value: 4,
    label: '201-500 employees'
  },
  {
    value: 5,
    label: '501-1000 employees'
  },
  {
    value: 6,
    label: '1001-5000 employees'
  },
  {
    value: 7,
    label: '5001-10,000 employees'
  },
  {
    value: 8,
    label: '10,001+ employees'
  }
];

// Values used in question about API's select input
const apiInterestedValues = [{ value: 1, label: 'No' }, { value: 2, label: 'Yes' }];

/**
 * Signup form: optional questions page
 */
const Questions = (props) => {
  const { setCompany, setPayment } = props;

  const dispatch = useDispatch();
  // Inputs values
  const knowAbout = useSelector(state => state.signup.knowAbout);
  const useCase = useSelector(state => state.signup.useCase);
  const companySize = useSelector(state => state.signup.companySize);
  const apiInterested = useSelector(state => state.signup.apiInterested);

  const onChangeValue = (inputName, value) => {
    switch (inputName) {
      case 'knowAbout':
        dispatch(setKnowAbout(value));
        break;
      case 'useCase':
        dispatch(setUseCase(value));
        break;
      case 'companySize':
        dispatch(setCompanySize(value));
        break;
      case 'apiInterested':
        dispatch(setApiInterested(value));
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
        Optional questions
      </Typography>

      <InputLabel sx={{ mt: '20px' }}>How did you hear about M Studio?</InputLabel>
      <CustomInput 
        placeholder="Type your answer" 
        fullWidth  
        id="know-about"
        name="know-about"
        value={knowAbout}
        onChange={(event) => onChangeValue('knowAbout', event.target.value)}
      />

      <InputLabel sx={{ mt: '20px' }}>Use case</InputLabel>
      <CustomInput 
        placeholder="Type your use case" 
        fullWidth  
        id="use-case"
        name="use-case"
        value={useCase}
        onChange={(event) => onChangeValue('useCase', event.target.value)}
      />
      
      <InputLabel sx={{ mt: '20px' }}>Company size</InputLabel>
      <SelectInput 
        items={companySizeValues}
        id="company-size"
        name="company-size"
        value={companySize}
        onChange={(event) => onChangeValue('companySize', event.target.value)}
      />

      <InputLabel sx={{ mt: '20px' }}>Are you interested in our API?</InputLabel>
      <SelectInput 
        items={apiInterestedValues}
        id="api-interested"
        name="api-interested"
        value={apiInterested}
        onChange={(event) => onChangeValue('apiInterested', event.target.value)}
      />

      <Box sx={{ display: 'flex', mt: 6 }}>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mr: 3 }}
          onClick={setCompany}
        >
          Back
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={setPayment}
          type="submit"
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
 
export default Questions;