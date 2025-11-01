import { useState } from "react";
import { searchCity } from "../api/weatherService";

export default function SearchBar({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  async function handleChange(e) {
    const text = e.target.value;
    setQ(text);
    if (text.length < 2) return setResults([]);
    const data = await searchCity(text);
    setResults(data);
  }

  return (
    <div className="relative">
      <input
        value={q}
        onChange={handleChange}
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        placeholder="Search city..."
      />

      {results.length > 0 && (
        <div className="absolute bg-gray-800 text-white w-full mt-1 rounded shadow-lg z-20">
          {results.map((c) => (
            <div
              key={`${c.lat},${c.lon}`}
              onClick={() => {
                onSelect(c);
                setQ("");
                setResults([]);
              }}
              className="p-2 hover:bg-gray-700 cursor-pointer"
            >
              {c.name}, {c.country}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
