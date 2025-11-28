import { useEffect, useState } from 'react'

export default function Clock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  const date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-900/50 to-slate-900">
      {/* Analog Clock Face */}
      <div className="relative w-48 h-48 mb-8 animate-fade-in">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-indigo-500/30 shadow-lg shadow-indigo-500/20">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-3 bg-white/50 rounded-full"
              style={{
                left: '50%',
                top: '8px',
                transformOrigin: '50% 88px',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
              }}
            />
          ))}
          {/* Hour hand */}
          <div
            className="absolute w-1.5 h-14 bg-white rounded-full left-1/2 bottom-1/2 origin-bottom transition-transform duration-1000"
            style={{ transform: `translateX(-50%) rotate(${(now.getHours() % 12) * 30 + now.getMinutes() * 0.5}deg)` }}
          />
          {/* Minute hand */}
          <div
            className="absolute w-1 h-20 bg-indigo-400 rounded-full left-1/2 bottom-1/2 origin-bottom transition-transform duration-1000"
            style={{ transform: `translateX(-50%) rotate(${now.getMinutes() * 6}deg)` }}
          />
          {/* Second hand */}
          <div
            className="absolute w-0.5 h-20 bg-red-500 rounded-full left-1/2 bottom-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${now.getSeconds() * 6}deg)` }}
          />
          {/* Center dot */}
          <div className="absolute w-3 h-3 bg-white rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg" />
        </div>
      </div>

      {/* Digital Time */}
      <div className="text-center animate-slide-up">
        <div className="flex items-center justify-center gap-2 text-5xl font-light tracking-wider">
          <span className="text-white">{hours}</span>
          <span className="text-indigo-400 animate-pulse">:</span>
          <span className="text-white">{minutes}</span>
          <span className="text-indigo-400 animate-pulse">:</span>
          <span className="text-indigo-300 text-3xl">{seconds}</span>
        </div>
        <p className="text-gray-400 mt-4 text-sm">{date}</p>
      </div>
    </div>
  )
}
