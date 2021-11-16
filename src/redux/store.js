import { configureStore } from '@reduxjs/toolkit';
import canvasReducer from './canvas/canvasSlice';
import toolbarReducer from './toolbar/toolbarSlice';
import navigationReducer from './navigation/navigationSlice';
import signupReducer from './form/signupSlice';
import alertReducer from './alert/alertSlice';
import userReducer from './user/userSlice';
import backdropReducer from './backdrop/backdropSlice';
import dialogAlertReducer from './dialog-alert/dialogAlertSlice';
import videoReducer from './video/videoSlice';

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    toolbar: toolbarReducer,
    navigation: navigationReducer,
    signup: signupReducer,
    alert: alertReducer,
    user: userReducer,
    backdrop: backdropReducer,
    dialogAlert: dialogAlertReducer,
    video: videoReducer
  },
})