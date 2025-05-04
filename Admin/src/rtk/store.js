import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import Cookies from "js-cookie";

export const store = configureStore({
  reducer: {
    user: authSlice,
  },
});

store.subscribe(() => {
  const state = store.getState().user.user;
  Cookies.set("user", JSON.stringify(state));
});
