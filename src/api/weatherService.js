import { fetchJSON } from "../utils/fetchJSON";
import { buildUrl } from "../utils/buildUrl";

const API = "https://api.openweathermap.org";
const key = import.meta.env.VITE_APP_OWM_KEY;

export async function searchCity(q) {
  return fetchJSON(
    buildUrl(`${API}/geo/1.0/direct`, { q, limit: 5, appid: key })
  );
}

export async function getCurrentWeather(lat, lon, units = "metric") {
  return fetchJSON(
    buildUrl(`${API}/data/2.5/weather`, { lat, lon, units, appid: key })
  );
}

export async function getForecast(lat, lon, units = "metric") {
  return fetchJSON(
    buildUrl(`${API}/data/2.5/forecast`, { lat, lon, units, appid: key })
  );
}
