import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    units: "metric",
  },
  reducers: {
    setUnits: (state, action) => {
      state.units = action.payload;
    },
  },
});

export const { setUnits } = settingsSlice.actions;
export default settingsSlice.reducer;
