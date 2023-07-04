import { createSlice } from '@reduxjs/toolkit';

/**
 * States used in signup form.
 */
const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  company: '',
  billingAddress: '',
  vat: '',
  knowAbout: '',
  useCase: '',
  companySize: '',
  apiInterested: '',
  paymentEmail: '',
  cardNumber: '',
  cardDate: '',
  cardCode: '',
  cardName: '',
  paymentCountry: ''
}

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setInitialState: (state, action) => {
      Object.keys(state).forEach(key => state[key] = '');
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action) => {
      state.confirmPassword = action.payload;
    },
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
    },
    setVat: (state, action) => {
      state.vat = action.payload;
    },
    setKnowAbout: (state, action) => {
      state.knowAbout = action.payload;
    },
    setUseCase: (state, action) => {
      state.useCase = action.payload;
    },
    setCompanySize: (state, action) => {
      state.companySize = action.payload;
    },
    setApiInterested: (state, action) => {
      state.apiInterested = action.payload;
    },
    setPaymentEmail: (state, action) => {
      state.paymentEmail = action.payload;
    },
    setCardNumber: (state, action) => {
      state.cardNumber = action.payload;
    },
    setCardDate: (state, action) => {
      state.cardDate = action.payload;
    },
    setCardCode: (state, action) => {
      state.cardCode = action.payload;
    },
    setCardName: (state, action) => {
      state.cardName = action.payload;
    },
    setPaymentCountry: (state, action) => {
      state.paymentCountry = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setInitialState, setName, setEmail, setPassword, setConfirmPassword,
  setCompany, setBillingAddress, setVat,
  setKnowAbout, setUseCase, setCompanySize, setApiInterested,
  setPaymentEmail, setCardNumber, setCardDate, setCardCode, setCardName, setPaymentCountry } = signupSlice.actions;

export default signupSlice.reducer;