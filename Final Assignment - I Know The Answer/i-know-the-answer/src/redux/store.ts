import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user-slice";
import matchReducer from "./features/match/match-slice";
import sessionReducer from "./features/session/session-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    match: matchReducer,
    session: sessionReducer,
  },
});

export type IRootState = ReturnType<typeof store.getState>;
