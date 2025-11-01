import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API = import.meta.env.VITE_APP_OWM_KEY;

// --- Load favorites + temp unit from localStorage ---
const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
const savedUnit = localStorage.getItem("unit") || "metric"; // "metric" = °C, "imperial" = °F

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
      unit, // store unit in city object too
    };
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    cities: [],
    favorites: savedFavorites,
    unit: savedUnit, // ✅ store selected unit
    status: "idle",
  },
  reducers: {
    toggleFavorite(state, action) {
      const exists = state.favorites.some(
        (c) => c.lat === action.payload.lat && c.lon === action.payload.lon
      );

      if (exists) {
        state.favorites = state.favorites.filter(
          (c) => c.lat !== action.payload.lat || c.lon !== action.payload.lon
        );
      } else {
        state.favorites.push(action.payload);
      }

      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },

    // ✅ Set Unit (°C / °F)
    setUnit(state, action) {
      state.unit = action.payload;
      localStorage.setItem("unit", action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchWeather.fulfilled, (state, action) => {
      const exists = state.cities.find(
        (c) => c.lat === action.payload.lat && c.lon === action.payload.lon
      );

      if (!exists) {
        state.cities.push(action.payload);
      } else {
        Object.assign(exists, action.payload); // update values
      }
    });
  },
});

export const { toggleFavorite, setUnit } = weatherSlice.actions;
export default weatherSlice.reducer;
