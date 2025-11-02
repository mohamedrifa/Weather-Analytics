import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchWeather, setUnit } from "../features/weather/weatherSlice";

export default function MetricButton({ cities }) {
  const dispatch = useDispatch();

  const unit = useSelector((s) => s.weather.unit);

  // detect mobile screen
  const isMobile = window.innerWidth <= 600;

  function toggleUnit() {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    dispatch(setUnit(newUnit));
    localStorage.setItem("unit", newUnit);

    cities.forEach((c) => {
      dispatch(fetchWeather({ lat: c.lat, lon: c.lon, unit: newUnit }));
    });
  }

  return (
    <button onClick={toggleUnit} className="px-4 py-2 bg-blue-500 rounded">
      {isMobile 
        ? (unit === "metric" ? "°F" : "°C") 
        : (unit === "metric" ? "Switch to °F" : "Switch to °C")}
    </button>
  );
}
