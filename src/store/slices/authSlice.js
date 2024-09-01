import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bool: true,
}

export const authSlice = createSlice ({
  name: 'auth',
  initialState,
  reducers: {
    setBool: (state, action) => {
      state.bool = action.payload;
    },
    toggleBool: (state) => {
      state.bool = !state.bool;
    }
  }
});

export const { setBool, toggleBool } = authSlice.actions;
export default authSlice.reducer;