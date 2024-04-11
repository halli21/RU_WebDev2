import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SessionState = {
  inMatch: boolean;
  currentGameId: string | null;
};

const initialState: SessionState = {
  inMatch: false,
  currentGameId: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setEnterMatch: (state, action: PayloadAction<string>) => {
      state.inMatch = true;
      state.currentGameId = action.payload;
    },

    setLeaveMatch: (state) => {
      state.inMatch = false;
      state.currentGameId = null;
    },
  },
});

export const { setEnterMatch, setLeaveMatch } = sessionSlice.actions;

export default sessionSlice.reducer;
