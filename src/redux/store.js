import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvas/canvasSlice';
import toolbarReducer from './toolbar/toolbarSlice';
import navigationReducer from './navigation/navigationSlice';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    toolbar: toolbarReducer,
    navigation: navigationReducer
  },
})