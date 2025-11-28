import { Wifi, Volume2, Battery } from 'lucide-react'

interface StatusBarProps {
  city: string
  temp: number
  condition: string
}

export function StatusBar({ city, temp, condition }: StatusBarProps) {
  const time = new Date()
  
  return (
    <header className="flex items-center justify-between px-6 pt-4 pb-2 relative z-50">
      {/* Left - Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>FocusOS</span>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">v3.0</span>
      </div>

      {/* Center - Time & Date */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 text-sm text-slate-200">
        <span className="font-medium">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span className="text-slate-400 hidden md:inline">
          {time.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      {/* Right - Weather & System */}
      <div className="flex items-center gap-4 text-xs text-slate-300">
        {/* Weather */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/40 border border-slate-700/50">
          <span className="font-medium">{city}</span>
          <span className="text-slate-500">•</span>
          <span>{temp}°C</span>
          <span className="text-slate-500 hidden sm:inline">{condition}</span>
        </div>

        {/* System Icons */}
        <div className="flex items-center gap-2 text-slate-400">
          <Wifi size={14} />
          <Volume2 size={14} />
          <div className="flex items-center gap-1">
            <Battery size={14} />
            <span className="text-[10px]">100%</span>
          </div>
        </div>
      </div>
    </header>
  )
}

