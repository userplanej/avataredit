import { createSlice } from '@reduxjs/toolkit';
import { pathnameEnum } from '../../components-site/constants/Pathname';

const initialState = {
  pathName: pathnameEnum.home
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setPathName: (state, action) => {
      state.pathName = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setPathName } = navigationSlice.actions;

export default navigationSlice.reducer;