import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  avatarPosition: null,
  isBack: false,
  isFront: false
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
    setAvatarPosition: (state, action) => {
      state.avatarPosition = action.payload;
    },
    setIsBack: (state, action) => {
      state.isBack = action.payload;
    },
    setIsFront: (state, action) => {
      state.isFront = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTop, setLeft, setWidth, setHeight, setAvatarPosition, setIsBack, setIsFront } = objectSlice.actions;

export default objectSlice.reducer;