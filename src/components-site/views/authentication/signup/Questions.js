import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import i18n from 'i18next';

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
    label: i18n.t('form.signup.questions.companySize.value1')
  },
  {
    value: 2,
    label: i18n.t('form.signup.questions.companySize.value2')
  },
  {
    value: 3,
    label: i18n.t('form.signup.questions.companySize.value3')
  },
  {
    value: 4,
    label: i18n.t('form.signup.questions.companySize.value4')
  },
  {
    value: 5,
    label: i18n.t('form.signup.questions.companySize.value5')
  },
  {
    value: 6,
    label: i18n.t('form.signup.questions.companySize.value6')
  },
  {
    value: 7,
    label: i18n.t('form.signup.questions.companySize.value7')
  },
  {
    value: 8,
    label: i18n.t('form.signup.questions.companySize.value8')
  }
];

// Values used in question about API's select input
const apiInterestedValues = [{ value: 1, label: i18n.t('common.no') }, { value: 2, label: i18n.t('common.yes') }];

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
        {i18n.t('form.signup.questions.title')}
      </Typography>
      <Typography variant="h6">{i18n.t('form.signup.questions.content')}</Typography>

      <InputLabel sx={{ mt: '20px' }}>{i18n.t('form.signup.questions.hearAbout')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('form.signup.questions.hearAboutPlaceholder')}
        fullWidth
        id="know-about"
        name="know-about"
        value={knowAbout}
        onChange={(event) => onChangeValue('knowAbout', event.target.value)}
      />

      <InputLabel sx={{ mt: '20px' }}>{i18n.t('form.signup.questions.useCase')}</InputLabel>
      <CustomInput
        placeholder={i18n.t('form.signup.questions.useCasePlaceholder')}
        fullWidth
        id="use-case"
        name="use-case"
        value={useCase}
        onChange={(event) => onChangeValue('useCase', event.target.value)}
      />
      
      <InputLabel sx={{ mt: '20px' }}>{i18n.t('form.signup.questions.companySize.title')}</InputLabel>
      <SelectInput 
        items={companySizeValues}
        id="company-size"
        name="company-size"
        value={companySize}
        onChange={(event) => onChangeValue('companySize', event.target.value)}
      />

      <InputLabel sx={{ mt: '20px' }}>{i18n.t('form.signup.questions.interested')}</InputLabel>
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
          {i18n.t('common.button.back')}
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={setPayment}
          type="submit"
        >
          {i18n.t('common.button.next')}
        </Button>
      </Box>
    </Box>
  );
}
 
export default Questions;