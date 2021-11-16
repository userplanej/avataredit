import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  open: false,
  title: '',
  message: '',
  buttonText: ''
}

export const dialogAlertSlice = createSlice({
  name: 'dialogAlert',
  initialState,
  reducers: {
    setDialogAlertOpen: (state, action) => {
      state.open = action.payload;
    },
    setDialogAlertTitle: (state, action) => {
      state.title = action.payload;
    },
    setDialogAlertMessage: (state, action) => {
      state.message = action.payload;
    },
    setDialogAlertButtonText: (state, action) => {
      state.buttonText = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setDialogAlertOpen, setDialogAlertTitle, setDialogAlertMessage, setDialogAlertButtonText } = dialogAlertSlice.actions;

export default dialogAlertSlice.reducer;