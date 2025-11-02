import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchWeather, setUnit } from "../features/weather/weatherSlice";
import SearchBar from "./SearchBar";
import CityCard from "./CityCard";
import MetricButton from "./MetricButton";

const defaultSuggestions = [
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { name: "Toronto", lat: 43.65107, lon: -79.347015 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const cities = useSelector((s) => s.weather.cities);
  const favorites = useSelector((s) => s.weather.favorites);
  const unit = useSelector((s) => s.weather.unit);


  const [showTracked, setShowTracked] = useState(false);

  useEffect(() => {
    const savedUnit = localStorage.getItem("unit");
    if (savedUnit) dispatch(setUnit(savedUnit));

    const savedTracked = JSON.parse(localStorage.getItem("trackedCities") || "[]");
    console.log(savedTracked);

    if (savedTracked.length > 0) setShowTracked(true);

    savedTracked.forEach((c) =>
      dispatch(fetchWeather({ ...c, unit: savedUnit || "metric" }))
    );
  }, [dispatch]);

  useEffect(() => {
    const trackedOnly = cities.filter(
      (c) =>
        !defaultSuggestions.some((d) => d.lat === c.lat && d.lon === c.lon)
    );
    if (trackedOnly.length > 0) {
      localStorage.setItem("trackedCities", JSON.stringify(trackedOnly));
    } else {
      localStorage.removeItem("trackedCities"); 
    }
  }, [cities]);


  useEffect(() => {
    const tracked = JSON.parse(localStorage.getItem("trackedCities") || "[]");

    defaultSuggestions
      .filter(
        (d) => !tracked.some((t) => t.lat === d.lat && t.lon === d.lon)
      )
      .forEach((c) => {
        dispatch(fetchWeather({ lat: c.lat, lon: c.lon, unit }));
      });
  }, [dispatch, unit]);

  useEffect(() => {
    favorites.forEach((c) => {
      dispatch(fetchWeather({ lat: c.lat, lon: c.lon, unit }));
    });
  }, [dispatch, favorites, unit]);

  function handleSelectCity(c) {
    dispatch(fetchWeather({ lat: c.lat, lon: c.lon, unit }));

    let recent = JSON.parse(localStorage.getItem("trackedCities") || "[]");
    recent = [{ name: c.name, lat: c.lat, lon: c.lon }, ...recent].slice(0, 10);
    localStorage.setItem("trackedCities", JSON.stringify(recent));

    setShowTracked(true);
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🌤 Weather Dashboard</h1>

        <MetricButton cities={cities}/>
      </div>

      <div className="mb-6 max-w-md">
        <SearchBar onSelect={handleSelectCity} />
      </div>

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

      {showTracked ? (
        (() => {
          const trackedList = cities
            .filter((c) => !defaultSuggestions.some((d) => d.lat === c.lat && d.lon === c.lon))
            .filter((c) => !favorites.some((f) => f.lat === c.lat && f.lon === c.lon));
          return trackedList.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-2">📍 Tracked Cities</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {trackedList.map((c) => (
                  <CityCard key={`${c.lat},${c.lon}`} city={c} />
                ))}
              </div>
            </>
          ) : null;
        })()
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">🏙 Suggested Cities</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cities
              .filter((c) =>
                defaultSuggestions.some(
                  (d) => d.lat === c.lat && d.lon === c.lon
                )
              )
              .map((c) => (
                <CityCard key={`${c.lat},${c.lon}`} city={c} />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
