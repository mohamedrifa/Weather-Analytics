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

        // prepare charts data from forecast.list (3-hourly)
        const list = forecast.list || [];
        const temp = [];
        const precip = [];
        const wind = [];
        const dailyMap = {};

        list.forEach((it) => {
          const dt = it.dt; // unix seconds
          const date = new Date(dt * 1000);
          const timeLabel = date.toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });

          temp.push({ dt, timeLabel, temp: it.main.temp, pop: it.pop ?? 0 });
          precip.push({ dt, timeLabel, pop: it.pop ?? 0, rain_mm: (it.rain && it.rain['3h']) ? it.rain['3h'] : 0 });
          wind.push({ dt, timeLabel, wind_speed: it.wind?.speed ?? 0, wind_gust: it.wind?.gust ?? null, wind_deg: it.wind?.deg ?? null });

          // daily average aggregation
          const dayKey = date.toISOString().split('T')[0];
          if (!dailyMap[dayKey]) dailyMap[dayKey] = { temps: [], weather: [], dt: dt };
          dailyMap[dayKey].temps.push(it.main.temp);
          dailyMap[dayKey].weather.push(it.weather[0]);
        });

        const daily = Object.keys(dailyMap).slice(0, 7).map((k) => {
          const entry = dailyMap[k];
          const avg = entry.temps.reduce((a,b)=>a+b,0) / entry.temps.length;
          return { dt: entry.dt, temp: { day: avg }, weather: [entry.weather[0]] };
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
    const city = { name: data.current?.name || `(${lat},${lon})`, lat: Number(lat), lon: Number(lon), country: data.current?.sys?.country };
    if (isFav) dispatch(removeFavorite({ lat: Number(lat), lon: Number(lon) }));
    else dispatch(addFavorite(city));
  }

  if (!data) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 text-white space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="text-blue-400 underline">← Back</button>
          <h2 className="text-2xl font-bold">{data.current?.name}</h2>
          <p className="text-gray-300">{data.current?.weather?.[0]?.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round(data.current.main.temp)}°{units==='metric'?'C':'F'}</div>
            <div className="text-sm text-gray-400">Feels like {Math.round(data.current.main.feels_like)}°</div>
          </div>
          <button
            onClick={handleToggleFav}
            className={`px-3 py-2 rounded ${isFav ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
          >
            {isFav ? 'Unfavorite' : 'Add Favorite'}
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-800 p-3 rounded">Humidity: {data.current.main.humidity}%</div>
        <div className="bg-gray-800 p-3 rounded">Pressure: {data.current.main.pressure} hPa</div>
        <div className="bg-gray-800 p-3 rounded">Wind: {data.current.wind.speed} {units==='metric'?'m/s':'mph'}</div>
        <div className="bg-gray-800 p-3 rounded">Visibility: {data.current.visibility ?? 'N/A'}</div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TempTrendChart data={charts.temp} units={units} />
        <PrecipChart data={charts.precip} />
        <WindChart data={charts.wind} units={units} />
      </div>

      {/* Daily summary */}
      <div>
        <h3 className="text-xl font-semibold mb-2">5-Day Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {charts.daily.map((d, idx) => (
            <div key={idx} className="bg-gray-800 p-3 rounded text-center">
              <div className="font-semibold">{new Date(d.dt * 1000).toLocaleDateString()}</div>
              <div className="text-lg font-bold">{Math.round(d.temp.day)}°</div>
              <div className="text-sm">{d.weather?.[0]?.main}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
