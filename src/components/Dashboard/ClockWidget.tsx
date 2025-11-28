import { useState, useEffect } from 'react'

export default function ClockWidget() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours % 12 || 12
  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
  const day = time.getDate()
  const month = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()

  return (
    <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-6 animate-fade-in">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="flex items-baseline gap-2">
          <span className="text-6xl font-light tracking-tight">
            {displayHours}:{String(minutes).padStart(2, '0')}
          </span>
          <span className="text-2xl font-light text-white/80">{ampm}</span>
        </div>
        
        <div className="mt-2 text-sm tracking-widest text-blue-200 font-medium">
          {dayName} {day} {month}
        </div>
      </div>

      {/* Subtle animation */}
      <div className="absolute top-4 right-4 flex gap-1">
        {[0, 1, 2].map(i => (
          <div 
            key={i}
            className="w-1 h-1 rounded-full bg-white/50 animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  )
}

