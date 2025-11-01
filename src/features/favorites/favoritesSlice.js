// src/features/favorites/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'fav_cities_v1';
const initial = {
  cities: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'), // [{name, lat, lon, country}]
};

const slice = createSlice({
  name: 'favorites',
  initialState: initial,
  reducers: {
    addFavorite(state, action) {
      const c = action.payload;
      const exists = state.cities.find(
        (x) => x.lat === c.lat && x.lon === c.lon
      );
      if (!exists) {
        state.cities.push(c);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cities));
      }
    },
    removeFavorite(state, action) {
      const { lat, lon } = action.payload;
      state.cities = state.cities.filter((x) => !(x.lat === lat && x.lon === lon));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cities));
    },
    clearFavorites(state) {
      state.cities = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = slice.actions;
export default slice.reducer;
