import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  video: null,
  slides: {},
  activeSlide: null,
  activeSlideId: 0,
  isSaving: false,
  selectedAvatar: null
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
    },
    setSelectedAvatar: (state, action) => {
      state.selectedAvatar = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setVideo, setSlides, setActiveSlide, setActiveSlideId, setIsSaving, setSelectedAvatar } = videoSlice.actions;

export default videoSlice.reducer;