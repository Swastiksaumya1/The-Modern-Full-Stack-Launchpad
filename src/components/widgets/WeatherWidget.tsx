import { Maximize2, Droplets, Wind, Thermometer } from 'lucide-react'
import type { WidgetProps, Weather } from '../../types/widgets'

interface WeatherWidgetProps extends WidgetProps {
  weather: Weather
  city: string
  loading: boolean
}

export function WeatherWidget({ editMode, onExpand, weather, city, loading }: WeatherWidgetProps) {
  const WeatherIcon = weather.icon

  return (
    <div className={`relative rounded-3xl bg-gradient-to-br from-sky-500/20 to-blue-600/20 backdrop-blur-md border border-sky-500/30 p-4 shadow-xl transition-all duration-200 ${
      editMode ? 'ring-2 ring-sky-400/70 animate-wiggle cursor-move' : 'hover:shadow-2xl hover:-translate-y-1'
    }`}>
      {/* Edit Mode Controls */}
      {editMode && (
        <div className="absolute right-3 top-3 flex items-center gap-2 z-10">
          <button className="px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-slate-400">
            Resize
          </button>
          <button className="h-5 w-5 rounded-full bg-red-500/90 flex items-center justify-center text-[10px] text-white">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-medium text-slate-200">Weather</h2>
          <p className="text-xs text-slate-400">{city}</p>
        </div>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Main Weather */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <WeatherIcon size={40} className="text-sky-300" />
              <div>
                <span className="text-4xl font-semibold text-slate-100">{weather.temp}°</span>
                <p className="text-xs text-slate-400">{weather.condition}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/40">
              <Thermometer size={14} className="text-orange-400 mb-1" />
              <span className="text-xs text-slate-400">Feels</span>
              <span className="text-sm font-medium text-slate-200">{weather.feelsLike}°</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/40">
              <Droplets size={14} className="text-blue-400 mb-1" />
              <span className="text-xs text-slate-400">Humidity</span>
              <span className="text-sm font-medium text-slate-200">{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/40">
              <Wind size={14} className="text-teal-400 mb-1" />
              <span className="text-xs text-slate-400">Wind</span>
              <span className="text-sm font-medium text-slate-200">{weather.wind} km/h</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

