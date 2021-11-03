import { createSlice } from '@reduxjs/toolkit';
import { drawerMaxWidth } from '../../components-site/constants/Drawer';

const initialState = {
  isMinimal: false,
  drawerWidth: drawerMaxWidth,
  pathName: '/home'
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setIsMinimal: (state, action) => {
      state.isMinimal = action.payload;
    },
    setDrawerWidth: (state, action) => {
      state.drawerWidth = action.payload;
    },
    setPathName: (state, action) => {
      state.pathName = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setIsMinimal, setDrawerWidth, setPathName } = navigationSlice.actions;

export default navigationSlice.reducer;