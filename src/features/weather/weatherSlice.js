import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_APP_OWM_KEY;

// Load from localStorage
const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
const savedUnit = localStorage.getItem("unit") || "metric";

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ lat, lon, unit }) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API}`
    );
    const json = await res.json();

    return {
      name: json.name,
      lat,
      lon,
      temp: json.main.temp,
      humidity: json.main.humidity,
      wind: json.wind.speed,
      weather: json.weather[0].main,
      feels_like: json.main.feels_like,
      unit,
      cachedAt: Date.now(),
    };
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    cities: [],                  // ✅ DO NOT preload here
    favorites: savedFavorites,   // ✅ load only favorites from storage
    unit: savedUnit,
    status: "idle",
  },

  reducers: {
    toggleFavorite(state, action) {
      const { lat, lon } = action.payload;

      const isFav = state.favorites.some(
        (c) => c.lat === lat && c.lon === lon
      );

      if (isFav) {
        // Remove from favorites & cached weather
        state.favorites = state.favorites.filter(
          (c) => c.lat !== lat || c.lon !== lon
        );
      } else {
        // Add to favorites
        state.favorites.push(action.payload);
      }

      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },

    setUnit(state, action) {
      state.unit = action.payload;
      localStorage.setItem("unit", action.payload);
    }
  },

  extraReducers: (builder) => {
    builder.addCase(fetchWeather.fulfilled, (state, action) => {
      const exists = state.cities.find(
        (c) => c.lat === action.payload.lat && c.lon === action.payload.lon
      );

      if (exists) {
        Object.assign(exists, action.payload);
      } else {
        state.cities.push(action.payload);
      }
    });
  },
});

export const { toggleFavorite, setUnit } = weatherSlice.actions;
export default weatherSlice.reducer;
