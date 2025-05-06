import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const getUserIfLogged = Cookies.get("patient")
  ? JSON.parse(Cookies.get("patient"))
  : null;

const initialState = {
  user: getUserIfLogged,
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
