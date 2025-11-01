import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFavorite } from "../features/cities/citiesSlice";

export default function SearchCity() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();

  const handleSearch = async (text) => {
    setQuery(text);

    if (text.length < 2) return;

    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${import.meta.env.VITE_APP_OWM_KEY}`
    );
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white"
        placeholder="Search for a city..."
      />

      {results.map((c, i) => (
        <div key={i} className="flex justify-between p-2 bg-gray-700 rounded mt-2">
          <span>{c.name}, {c.country}</span>
          <button
            onClick={() => dispatch(addFavorite({ id: c.lat + c.lon, ...c }))}
            className="text-yellow-400"
          >⭐</button>
        </div>
      ))}
    </div>
  );
}
