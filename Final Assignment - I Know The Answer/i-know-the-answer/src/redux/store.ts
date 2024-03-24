import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user-slice";

export const store = configureStore({
    reducer: {
        user: userReducer
    },
});

export type IRootState = ReturnType<typeof store.getState>;