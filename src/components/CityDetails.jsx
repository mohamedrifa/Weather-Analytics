import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TempTrendChart from "../components/charts/TempTrendChart";
import PrecipChart from "../components/charts/PrecipChart";
import WindChart from "../components/charts/WindChart";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../features/favorites/favoritesSlice";

export default function CityDetails() {
  const { lat, lon } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const units = useSelector((s) => s.settings?.units ?? "metric");
  const favs = useSelector((s) => s.favorites?.cities ?? []);
  const [data, setData] = useState(null);
  const [charts, setCharts] = useState({ temp: [], precip: [], wind: [], daily: [] });

  const isFav = favs.some((c) => `${c.lat}` === `${lat}` && `${c.lon}` === `${lon}`);

  useEffect(() => {
    async function load() {
      try {
        const currentRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${import.meta.env.VITE_APP_OWM_KEY}`
        );
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${import.meta.env.VITE_APP_OWM_KEY}`
        );

        const current = await currentRes.json();
        const forecast = await forecastRes.json();
        setData({ current, forecast });

        const list = forecast.list || [];
        const temp = [];
        const precip = [];
        const wind = [];
        const dailyMap = {};

        list.forEach((it) => {
          const dt = it.dt;
          const date = new Date(dt * 1000);
          const timeLabel = date.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });

          temp.push({ dt, timeLabel, temp: it.main.temp });
          precip.push({ dt, timeLabel, pop: it.pop ?? 0, rain_mm: it.rain?.["3h"] ?? 0 });
          wind.push({ dt, timeLabel, wind_speed: it.wind?.speed ?? 0 });

          const dayKey = date.toISOString().split('T')[0];
          if (!dailyMap[dayKey]) dailyMap[dayKey] = { temps: [], weather: [], dt };
          dailyMap[dayKey].temps.push(it.main.temp);
          dailyMap[dayKey].weather.push(it.weather[0]);
        });

        const daily = Object.keys(dailyMap).slice(0, 7).map((k) => {
          const e = dailyMap[k];
          const avg = e.temps.reduce((a,b)=>a+b,0) / e.temps.length;
          return { dt: e.dt, temp: { day: avg }, weather: [e.weather[0]] };
        });

        setCharts({ temp, precip, wind, daily });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [lat, lon, units]);

  function handleToggleFav() {
    if (!data) return;
    const city = {
      name: data.current?.name || `(${lat},${lon})`,
      lat: Number(lat),
      lon: Number(lon),
      country: data.current?.sys?.country,
      weatherCache: {
        temp: data.current.main.temp,
        humidity: data.current.main.humidity,
        wind: data.current.wind.speed,
        weather: data.current.weather[0].main,
        feels_like: data.current.main.feels_like,
        unit: units,
      },
      cachedAt: Date.now(),
    };

    if (isFav) {
      dispatch(removeFavorite({ lat: city.lat, lon: city.lon }));
    } else {
      dispatch(addFavorite(city));
    }
  }

  if (!data) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-500 rounded font-medium"
        >
          ← Back
        </button>

        <button
          onClick={handleToggleFav}
          className={`px-4 py-2 rounded font-medium ${
            isFav ? "bg-yellow-400 text-black" : "bg-blue-500"
          }`}
        >
          {isFav ? "★ Favorited" : "☆ Add Favorite"}
        </button>
      </div>

      {/* City Info */}
      <div>
        <h1 className="text-3xl font-bold">{data.current?.name}</h1>
        <p className="text-gray-300 text-lg">{data.current?.weather?.[0]?.description}</p>
      </div>

      {/* Main Temp */}
      <div className="flex items-center gap-6 mt-2">
        <div className="text-5xl font-bold">
          {Math.round(data.current.main.temp)}°{units === "metric" ? "C" : "F"}
        </div>
        <div className="text-gray-400 text-lg">
          Feels like {Math.round(data.current.main.feels_like)}°
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">Humidity: {data.current.main.humidity}%</div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">Pressure: {data.current.main.pressure} hPa</div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">Wind: {data.current.wind.speed} {units==='metric'?'m/s':'mph'}</div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">Visibility: {data.current.visibility}</div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <TempTrendChart data={charts.temp} units={units} />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <PrecipChart data={charts.precip} units={units} />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg lg:col-span-2">
          <WindChart data={charts.wind} units={units} />
        </div>
      </div>

      {/* Daily Forecast */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">5-Day Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {charts.daily.map((d, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="font-semibold">{new Date(d.dt * 1000).toLocaleDateString()}</div>
              <div className="text-2xl font-bold mt-1">{Math.round(d.temp.day)}°</div>
              <div className="text-sm text-gray-300">{d.weather?.[0]?.main}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
