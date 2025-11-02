import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TempTrendChart from "../components/citydetails/TempTrendChart";
import PrecipChart from "../components/citydetails/PrecipChart";
import WindChart from "../components/citydetails/WindChart";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../features/favorites/favoritesSlice";
import Loader from "../components/Loader";
import { getWeatherIcon } from "../utils/weatherIcons";


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

        let days = Object.keys(dailyMap);
        let daily = days.map((k) => {
          const e = dailyMap[k];
          const avg = e.temps.reduce((a,b)=>a+b,0) / e.temps.length;
          return { dt: e.dt, temp: { day: avg }, weather: [e.weather[0]] };
        });

        if (daily.length < 7) {
          const last = daily[daily.length - 1];
          while (daily.length < 7) {
            const nextDt = last.dt + 24 * 60 * 60 * (daily.length - days.length + 1);
            const nextTemp = last.temp.day + (Math.random() * 2 - 1);
            daily.push({ dt: nextDt, temp: { day: nextTemp }, weather: last.weather, estimated: true });
          }
        }

        setCharts({ temp, precip, wind, daily });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [lat, lon, units]);

  useEffect(() => {
    if (!sessionStorage.getItem("dashboardReloaded")) {
      sessionStorage.setItem("dashboardReloaded", "true");
      window.location.reload();
    }
    return () => sessionStorage.removeItem("dashboardReloaded");
  }, []);

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

    if (isFav) dispatch(removeFavorite({ lat: city.lat, lon: city.lon }));
    else dispatch(addFavorite(city));
  }

  if (!data) return <Loader label="Fetching Weather Data..." />;

  return (
  <div className="bg-gray-900 min-h-screen p-4 md:p-6 text-white space-y-6 md:space-y-8">

    {/* Header */}
    <div className="flex justify-between items-center mb-4 md:mb-6">
      <button
        onClick={() => navigate(-1)}
        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm md:text-base"
      >
        ← Back
      </button>

      <button
        onClick={handleToggleFav}
        className={`px-3 md:px-4 py-2 rounded-lg font-semibold shadow text-lg 
          ${isFav ? "bg-yellow-400 text-black" : "bg-transparent hover:bg-blue-500"}
        `}
      >
        {isFav ? "★" : "☆"}
      </button>
    </div>

    {/* City */}
    <div className="text-left space-y-1">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-extrabold">{data.current?.name}</h1>
        {getWeatherIcon(data.current?.weather?.[0]?.main)}
      </div>
      <p className="text-gray-300 text-sm md:text-lg capitalize">
        {data.current?.weather?.[0]?.description}
      </p>
    </div>

    {/* Temperature */}
    <div className="mt-3">
      <div className="text-5xl md:text-6xl font-extrabold">
        {Math.round(data.current.main.temp)}°{units === "metric" ? "C" : "F"}
      </div>
      <div className="text-gray-400 text-sm md:text-lg">
        Feels like {Math.round(data.current.main.feels_like)}°
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {[
        { label: "Humidity", val: `${data.current.main.humidity}%` },
        { label: "Pressure", val: `${data.current.main.pressure} hPa` },
        { label: "Wind", val: `${data.current.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}` },
        { label: "Visibility", val: `${data.current.visibility}` },
      ].map((item, i) => (
        <div key={i} className="bg-gray-800/60 p-3 md:p-4 rounded-xl text-center border border-gray-700">
          <div className="text-gray-400 text-xs md:text-sm">{item.label}</div>
          <div className="text-lg md:text-xl font-semibold mt-1">{item.val}</div>
        </div>
      ))}
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-gray-800/70 p-3 md:p-5 rounded-xl border border-gray-700">
        <TempTrendChart data={charts.temp} units={units} />
      </div>
      <div className="bg-gray-800/70 p-3 md:p-5 rounded-xl border border-gray-700">
        <PrecipChart data={charts.precip} units={units} />
      </div>
      <div className="bg-gray-800/70 p-3 md:p-5 rounded-xl border border-gray-700 lg:col-span-2">
        <WindChart data={charts.wind} units={units} />
      </div>
    </div>

    {/* Forecast */}
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">7-Day Forecast</h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 md:gap-4">
        {charts.daily.map((d, i) => (
          <div key={i} className="bg-gray-800/60 p-3 md:p-4 rounded-xl text-center border border-gray-700">
            <div className="text-gray-300 text-xs md:text-sm">
              {new Date(d.dt * 1000).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>

            <div className="flex justify-center mt-1">
              {getWeatherIcon(d.weather?.[0]?.main, "text-xl md:text-4xl")}
            </div>

            <div className="text-lg md:text-2xl font-bold mt-1">{Math.round(d.temp.day)}°</div>
            <div className="text-[10px] md:text-xs mt-1 text-gray-400">{d.weather?.[0]?.main}</div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

}
