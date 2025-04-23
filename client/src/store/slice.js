import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  theme: 'light'
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    clearUserData: (state) => {
      state.user = null;
      state.token = null;
    }
  }
});

export const { setUser, setToken, setTheme, clearUserData } = userSlice.actions;
export default userSlice.reducer;