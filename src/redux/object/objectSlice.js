import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  isBack: false,
  isFront: false,
  avatarPose: null,
  avatarPosition: null,
  avatarSize: null,
  avatarType: null
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
    },
    setAvatarPose: (state, action) => {
      state.avatarPose = action.payload;
    },
    setAvatarSize: (state, action) => {
      state.avatarSize = action.payload;
    },
    setAvatarType: (state, action) => {
      state.avatarType = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTop, setLeft, setWidth, setHeight, setAvatarPosition, setIsBack, setIsFront, setAvatarPose, setAvatarSize, setAvatarType } = objectSlice.actions;

export default objectSlice.reducer;