import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../features/weather/weatherSlice";
import { useNavigate } from "react-router-dom";

export default function CityCard({ city }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFav = useSelector((s) =>
    s.weather.favorites.some((f) => f.lat === city.lat && f.lon === city.lon)
  );

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white flex flex-col gap-2 relative">

      {/* Favorite Button */}
      <button
        onClick={() => dispatch(toggleFavorite(city))}
        className="absolute top-2 right-2 text-xl"
        title="Add to favorites"
      >
        {isFav ? "⭐" : "☆"}
      </button>

      {/* Clickable area to open city details */}
      <div
        onClick={() => navigate(`/city/${city.lat}/${city.lon}`)}
        className="cursor-pointer"
      >
        <h3 className="text-xl font-bold">{city.name}</h3>
        <p className="text-3xl font-semibold">
          {Math.round(city.temp)}°
        </p>
        <p className="capitalize text-gray-300">{city.weather}</p>

        <div className="text-sm text-gray-400 mt-1">
          💧 {city.humidity}% | 🌬 {city.wind} m/s
        </div>
      </div>
    </div>
  );
}
