import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchWeather } from "../features/weather/weatherSlice";
import SearchBar from "./SearchBar";
import CityCard from "./CityCard";

export default function Dashboard() {
  const dispatch = useDispatch();
  const cities = useSelector((s) => s.weather.cities);
  const favorites = useSelector((s) => s.weather.favorites);

  // ✅ Auto-fetch favorite cities on load
  useEffect(() => {
    favorites.forEach((c) => {
      dispatch(fetchWeather({ lat: c.lat, lon: c.lon }));
    });
  }, [dispatch]);

  function handleSelectCity(c) {
    dispatch(fetchWeather({ lat: c.lat, lon: c.lon }));
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">🌤 Weather Dashboard</h1>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchBar onSelect={handleSelectCity} />
      </div>

      {/* Favorite Cities */}
      {favorites.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">⭐ Favorite Cities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cities
              .filter((c) =>
                favorites.some((f) => f.lat === c.lat && f.lon === c.lon)
              )
              .map((c) => (
                <CityCard key={`${c.lat},${c.lon}`} city={c} />
              ))}
          </div>
        </>
      )}

      {/* All Cities */}
      <h2 className="text-xl font-semibold mb-2">📍 Tracked Cities</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities
          .filter(
            (c) => !favorites.some((f) => f.lat === c.lat && f.lon === c.lon)
          )
          .map((c) => (
            <CityCard key={`${c.lat},${c.lon}`} city={c} />
          ))}
      </div>
    </div>
  );
}
