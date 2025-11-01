import { createSlice } from "@reduxjs/toolkit";

const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    favorites: storedFavorites
  },
  reducers: {
    addFavorite: (state, action) => {
      if (!state.favorites.some(c => c.id === action.payload.id)) {
        state.favorites.push(action.payload);
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(c => c.id !== action.payload);
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    }
  }
});

export const { addFavorite, removeFavorite } = citiesSlice.actions;
export default citiesSlice.reducer;
