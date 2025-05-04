import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const getUserInCookies = Cookies.get("user")
  ? JSON.parse(Cookies.get("user"))
  : null;

const initialState = {
  user: getUserInCookies,
};

export const authSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
