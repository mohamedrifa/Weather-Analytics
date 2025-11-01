import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import citiesReducer from '../features/favorites/cities/citiesSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    cities: citiesReducer
  },
});
