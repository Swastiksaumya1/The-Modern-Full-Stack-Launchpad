import { useEffect, useState } from 'react'
import { Play, Pause, RotateCcw, Plus, Minus, Bell } from 'lucide-react'

export default function Timer() {
  const [running, setRunning] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(60 * 5)
  const [initialSeconds, setInitialSeconds] = useState(60 * 5)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    let id: number | undefined
    if (running && secondsLeft > 0) {
      id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000)
    }
    if (secondsLeft === 0 && running) {
      setRunning(false)
      setFinished(true)
    }
    return () => { if (id) clearInterval(id) }
  }, [running, secondsLeft])

  function startPause() {
    if (finished) {
      setFinished(false)
      setSecondsLeft(initialSeconds)
    }
    setRunning((r) => !r)
  }

  function reset() {
    setRunning(false)
    setFinished(false)
    setSecondsLeft(initialSeconds)
  }

  function adjustTime(delta: number) {
    if (!running) {
      const newTime = Math.max(60, secondsLeft + delta)
      setSecondsLeft(newTime)
      setInitialSeconds(newTime)
    }
  }

  function setPreset(minutes: number) {
    if (!running) {
      setSecondsLeft(minutes * 60)
      setInitialSeconds(minutes * 60)
      setFinished(false)
    }
  }

  const mm = Math.floor(secondsLeft / 60)
  const ss = secondsLeft % 60
  const progress = initialSeconds > 0 ? ((initialSeconds - secondsLeft) / initialSeconds) * 100 : 0
  const circumference = 2 * Math.PI * 90

  return (
    <div className={`h-full flex flex-col items-center justify-center p-6 transition-colors duration-500 ${
      finished ? 'bg-gradient-to-br from-red-900 via-orange-900 to-red-900' : 'bg-gradient-to-br from-slate-900 via-amber-900/30 to-slate-900'
    }`}>
      {/* Finished Alert */}
      {finished && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 animate-fade-in">
          <div className="text-center animate-bounce">
            <Bell size={64} className="mx-auto text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Time's Up!</h2>
            <button
              onClick={reset}
              className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Circular Progress */}
      <div className="relative w-52 h-52 mb-6 animate-fade-in">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="104" cy="104" r="90" stroke="currentColor" strokeWidth="8" fill="none" className="text-white/10" />
          <circle
            cx="104" cy="104" r="90"
            stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round"
            className="text-amber-500 transition-all duration-1000"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - (progress / 100) * circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-light tracking-wider">
            {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Time Adjust */}
      {!running && (
        <div className="flex items-center gap-4 mb-6 animate-slide-up">
          <button
            onClick={() => adjustTime(-60)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <Minus size={18} />
          </button>
          <span className="text-sm text-gray-400 w-16 text-center">{mm} min</span>
          <button
            onClick={() => adjustTime(60)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <Plus size={18} />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <button
          onClick={reset}
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <RotateCcw size={22} />
        </button>
        <button
          onClick={startPause}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg ${
            running
              ? 'bg-gradient-to-br from-orange-500 to-red-500'
              : 'bg-gradient-to-br from-amber-500 to-orange-500'
          }`}
        >
          {running ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <div className="w-14 h-14" />
      </div>

      {/* Presets */}
      <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {[1, 5, 10, 15, 30].map(m => (
          <button
            key={m}
            onClick={() => setPreset(m)}
            disabled={running}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              initialSeconds === m * 60 && !running
                ? 'bg-amber-500/30 text-amber-300 ring-1 ring-amber-500'
                : 'bg-white/5 hover:bg-white/10 disabled:opacity-50'
            }`}
          >
            {m}m
          </button>
        ))}
      </div>
    </div>
  )
}
