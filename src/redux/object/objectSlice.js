import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  top: 0,
  left: 0,
  width: 0,
  height: 0
}

export const objectSlice = createSlice({
  name: 'object',
  initialState,
  reducers: {
    setTop: (state, action) => {
      state.top = action.payload;
    },
    setLeft: (state, action) => {
      state.left = action.payload;
    },
    setWidth: (state, action) => {
      state.width = action.payload;
    },
    setHeight: (state, action) => {
      state.height = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTop, setLeft, setWidth, setHeight } = objectSlice.actions;

export default objectSlice.reducer;