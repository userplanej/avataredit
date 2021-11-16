import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video: {}
}

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setVideo } = videoSlice.actions;

export default videoSlice.reducer;