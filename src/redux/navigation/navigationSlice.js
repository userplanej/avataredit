import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isMinimal: true,
  drawerWidth: 80
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
    }
  },
})

// Action creators are generated for each case reducer function
export const { setIsMinimal, setDrawerWidth } = navigationSlice.actions;

export default navigationSlice.reducer;