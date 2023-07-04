import { createSlice } from '@reduxjs/toolkit'

/**
 * States used for alert.
 * - message: Message displayed in alert.
 * - severity: Defines alert's color. Can be [error, info, success, warning]. Default is info.
 * - open: Should alert display or not.
 */

const initialState = {
  message: '',
  severity: 'info',
  open: false
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlertMessage: (state, action) => {
      state.message = action.payload;
    },
    setAlertSeverity: (state, action) => {
      state.severity = action.payload;
    },
    setAlertOpen: (state, action) => {
      state.open = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAlertMessage, setAlertSeverity, setAlertOpen } = alertSlice.actions;

export default alertSlice.reducer;