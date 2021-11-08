import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeObject: null,
  canvasRef: null
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setActiveObject: (state, action) => {
      state.activeObject = action.payload;
    },
    setCanvasRef: (state, action) => {
      state.canvasRef = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setActiveObject, setCanvasRef } = canvasSlice.actions;

export default canvasSlice.reducer;