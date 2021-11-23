import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video: {},
  slides: {},
  activeSlideId: 0
}

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideo: (state, action) => {
      state.video = action.payload;
    },
    setSlides: (state, action) => {
      state.slides = action.payload;
    },
    setActiveSlideId: (state, action) => {
      state.activeSlideId = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setVideo, setSlides, setActiveSlideId } = videoSlice.actions;

export default videoSlice.reducer;