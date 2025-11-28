import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react'

export default function WeatherWidget() {
  // Simulated weather data
  const weather = {
    temp: 22,
    condition: 'Partly Cloudy',
    location: 'San Francisco',
    humidity: 65,
    wind: 12,
    forecast: [
      { day: 'Mon', temp: 22, icon: Sun },
      { day: 'Tue', temp: 24, icon: Sun },
      { day: 'Wed', temp: 20, icon: Cloud },
      { day: 'Thu', temp: 18, icon: CloudRain },
      { day: 'Fri', temp: 21, icon: Sun },
    ]
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl overflow-hidden animate-fade-in relative">
      {/* Decorative clouds */}
      <div className="absolute top-4 right-4 text-white/20">
        <Cloud size={60} />
      </div>
      <div className="absolute bottom-10 left-4 text-white/10">
        <Cloud size={40} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-5 flex-1">
        <div className="text-sm text-white/70 mb-1">{weather.location}</div>
        <div className="flex items-start gap-4">
          <div>
            <div className="text-5xl font-light">{weather.temp}°</div>
            <div className="text-sm text-white/70 mt-1">{weather.condition}</div>
          </div>
          <Sun size={48} className="text-yellow-300 animate-pulse" />
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Droplets size={14} />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Wind size={14} />
            <span>{weather.wind} km/h</span>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="bg-black/20 backdrop-blur-sm px-5 py-3 flex justify-between">
        {weather.forecast.map((day, i) => (
          <div key={i} className="text-center">
            <div className="text-xs text-white/60 mb-1">{day.day}</div>
            <day.icon size={16} className="mx-auto mb-1" />
            <div className="text-sm font-medium">{day.temp}°</div>
          </div>
        ))}
      </div>
    </div>
  )
}

