import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_APP_OWM_KEY;

// --- Load favorites from localStorage ---
const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ lat, lon }) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API}`
    );
    const json = await res.json();

    return {
      name: json.name,
      lat,
      lon,
      temp: json.main.temp,
      humidity: json.main.humidity,
      wind: json.wind.speed,
      weather: json.weather[0].main
    };
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    cities: [],
    favorites: savedFavorites, // store favs
    status: "idle",
  },
  reducers: {
    toggleFavorite(state, action) {
      const exists = state.favorites.find(
        (c) => c.lat === action.payload.lat && c.lon === action.payload.lon
      );

      if (exists) {
        state.favorites = state.favorites.filter(
          (c) => c.lat !== action.payload.lat || c.lon !== action.payload.lon
        );
      } else {
        state.favorites.push(action.payload);
      }

      // ✅ Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.fulfilled, (state, action) => {
        const exists = state.cities.find(
          (c) => c.lat === action.payload.lat && c.lon === action.payload.lon
        );

        if (!exists) {
          state.cities.push(action.payload);
        } else {
          Object.assign(exists, action.payload);
        }
      });
  },
});

export const { toggleFavorite } = weatherSlice.actions;
export default weatherSlice.reducer;
