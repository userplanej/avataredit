import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeObject: null,
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setActiveObject: (state, action) => {
      state.activeObject = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setActiveObject } = canvasSlice.actions;

export default canvasSlice.reducer;