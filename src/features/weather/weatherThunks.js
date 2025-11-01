import { createAsyncThunk } from '@reduxjs/toolkit';
import { geocodeCity, getOneCall } from '../../api/weatherService';


// Fetch weather by coordinates (wraps the service)
export const fetchWeatherForCoords = createAsyncThunk(
'weather/fetchForCoords',
async ({ lat, lon, units = 'metric' }, { rejectWithValue }) => {
try {
const data = await getOneCall(lat, lon, units);
return { key: `${lat},${lon}`, lat, lon, data, fetchedAt: Date.now() };
} catch (err) {
return rejectWithValue(err.message || err);
}
}
);


// Fetch a city by name -> geocode -> fetch weather for first match
export const fetchWeatherByCityName = createAsyncThunk(
'weather/fetchByCityName',
async ({ q, units = 'metric' }, { rejectWithValue }) => {
try {
const results = await geocodeCity(q);
if (!results || results.length === 0) throw new Error('No matching city found');
const first = results[0];
const data = await getOneCall(first.lat, first.lon, units);
return { key: `${first.lat},${first.lon}`, lat: first.lat, lon: first.lon, city: first, data, fetchedAt: Date.now() };
} catch (err) {
return rejectWithValue(err.message || err);
}
}
);


// Batch fetch for multiple coords (used for favorites polling)
export const fetchWeatherForBatch = createAsyncThunk(
'weather/fetchBatch',
async ({ coords = [], units = 'metric' }, { dispatch, rejectWithValue }) => {
try {
const res = [];
for (const c of coords) {
const d = await getOneCall(c.lat, c.lon, units);
res.push({ key: `${c.lat},${c.lon}`, lat: c.lat, lon: c.lon, data: d, fetchedAt: Date.now() });
}
return res;
} catch (err) {
return rejectWithValue(err.message || err);
}
}
);