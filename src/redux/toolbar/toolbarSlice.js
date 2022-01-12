import { createSlice } from '@reduxjs/toolkit'

/**
 * States used to define editor toolbar props.
 */
const initialState = {
  activeTab: 0,
  previousTab: 0
}

export const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setPreviousTab: (state, action) => {
      state.previousTab = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setActiveTab, setPreviousTab } = toolbarSlice.actions;

export default toolbarSlice.reducer;