import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  showBackdrop: false
}

export const backdropSlice = createSlice({
  name: 'backdrop',
  initialState,
  reducers: {
    setShowBackdrop: (state, action) => {
      state.showBackdrop = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setShowBackdrop } = backdropSlice.actions;

export default backdropSlice.reducer;