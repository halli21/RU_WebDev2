import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Match } from "../../../types/match";
import { fetchWithCredentials } from "../../../utilities/fetch-utilites";

export const getMatches = createAsyncThunk("matches/getMatches", async () => {
  const response = await fetchWithCredentials("matches");
  const data = (await response.json()) as Match[];
  return data;
});

type MatchesState = {
  status: "loading" | "idle";
  error: string | null;
  matches: Match[];
};

const initialState: MatchesState = {
  matches: [],
  error: null,
  status: "idle",
};

export const matchSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMatches.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getMatches.fulfilled, (state, action) => {
      state.matches = action.payload;
      state.status = "idle";
    });

    builder.addCase(getMatches.rejected, (state, action) => {
      if (action.payload) {
        state.error = "Could not retrieve matches.";
      }
      state.status = "idle";
    });
  },
});

export const { setMatches } = matchSlice.actions;

export default matchSlice.reducer;
