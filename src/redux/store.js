import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvas/canvasSlice';
import toolbarReducer from './toolbar/toolbarSlice';
import navigationReducer from './navigation/navigationSlice';
import signupReducer from './form/signupSlice';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    toolbar: toolbarReducer,
    navigation: navigationReducer,
    signup: signupReducer
  },
})