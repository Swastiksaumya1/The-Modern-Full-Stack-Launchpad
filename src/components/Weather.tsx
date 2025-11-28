import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets } from 'lucide-react'

type WeatherData = {
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  humidity: number
  wind: number
  city: string
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  windy: Wind,
}

const conditions = ['sunny', 'cloudy', 'rainy', 'windy'] as const

export default function Weather() {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: 'sunny',
    humidity: 65,
    wind: 12,
    city: 'San Francisco',
  })
  const [loading, setLoading] = useState(false)

  // Simulate weather fetch
  const refreshWeather = () => {
    setLoading(true)
    setTimeout(() => {
      setWeather({
        temp: Math.floor(Math.random() * 25) + 10,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 50) + 40,
        wind: Math.floor(Math.random() * 30) + 5,
        city: weather.city,
      })
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    refreshWeather()
  }, [])

  const WeatherIcon = weatherIcons[weather.condition]
  const bgGradients = {
    sunny: 'from-yellow-500/20 via-orange-500/10 to-transparent',
    cloudy: 'from-gray-500/20 via-slate-500/10 to-transparent',
    rainy: 'from-blue-500/20 via-slate-500/10 to-transparent',
    windy: 'from-cyan-500/20 via-teal-500/10 to-transparent',
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${bgGradients[weather.condition]} border border-white/10 mb-4 animate-fade-in`}>
        {loading && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm">{weather.city}</p>
            <p className="text-5xl font-light text-white">{weather.temp}°C</p>
          </div>
          <div className="animate-float">
            <WeatherIcon size={64} className="text-white/80" strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-lg text-white/80 capitalize mb-4">{weather.condition}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
            <Droplets size={18} className="text-blue-400" />
            <div>
              <p className="text-xs text-gray-400">Humidity</p>
              <p className="text-sm font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
            <Wind size={18} className="text-cyan-400" />
            <div>
              <p className="text-xs text-gray-400">Wind</p>
              <p className="text-sm font-semibold">{weather.wind} km/h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">5-Day Forecast</h3>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => {
          const Icon = weatherIcons[conditions[i % conditions.length]]
          return (
            <div key={day} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="text-sm text-gray-300 w-12">{day}</span>
              <Icon size={20} className="text-white/60" />
              <span className="text-sm font-semibold">{Math.floor(Math.random() * 10) + 15}°</span>
            </div>
          )
        })}
      </div>

      <button
        onClick={refreshWeather}
        disabled={loading}
        className="w-full mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? 'Refreshing...' : 'Refresh Weather'}
      </button>
    </div>
  )
}

