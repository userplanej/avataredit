import { createSlice } from '@reduxjs/toolkit';

/**
 * States used in user informations update.
 */
const initialState = {
  canSave: false,
  userUpdated: null,
  reloadUser: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCanSave: (state, action) => {
      state.canSave = action.payload;
    },
    setUserUpdated: (state, action) => {
      state.userUpdated = action.payload;
    },
    setReloadUser: (state, action) => {
      state.reloadUser = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCanSave, setUserUpdated, setReloadUser } = userSlice.actions;

export default userSlice.reducer;