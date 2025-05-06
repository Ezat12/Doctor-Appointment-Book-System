import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import Cookies from "js-cookie";

export const stor = configureStore({
  reducer: {
    user: authSlice,
  },
});

stor.subscribe(() => {
  const state = stor.getState().user.user;

  Cookies.set("patient", JSON.stringify(state));
});
