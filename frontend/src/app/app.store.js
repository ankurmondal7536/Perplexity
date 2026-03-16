import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authentication/auth.slice.js";
export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});