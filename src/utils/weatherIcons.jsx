import { 
  WiDaySunny,
  WiCloud,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiDayCloudy
} from "react-icons/wi";

export function getWeatherIcon(main) {
  switch (main) {
    case "Clear":
      return <WiDaySunny className="text-5xl text-yellow-300" />;
    case "Clouds":
      return <WiCloud className="text-5xl text-gray-300" />;
    case "Rain":
      return <WiRain className="text-5xl text-blue-400" />;
    case "Thunderstorm":
      return <WiThunderstorm className="text-5xl text-yellow-400" />;
    case "Snow":
      return <WiSnow className="text-5xl text-blue-200" />;
    case "Fog":
    case "Mist":
    case "Haze":
      return <WiFog className="text-5xl text-gray-400" />;
    default:
      return <WiDayCloudy className="text-5xl text-gray-300" />;
  }
}
