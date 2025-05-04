import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";

export const stor = configureStore({
  reducer: {
    user: authSlice,
  },
});
