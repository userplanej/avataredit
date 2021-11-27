import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video: null,
  slides: {},
  activeSlide: null,
  activeSlideId: 0,
  isSaving: false
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
    setActiveSlide: (state, action) => {
      state.activeSlide = action.payload;
    },
    setActiveSlideId: (state, action) => {
      state.activeSlideId = action.payload;
    },
    setIsSaving: (state, action) => {
      state.isSaving = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setVideo, setSlides, setActiveSlide, setActiveSlideId, setIsSaving } = videoSlice.actions;

export default videoSlice.reducer;