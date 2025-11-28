import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react'
import type { WidgetProps } from '../../types/widgets'

interface FocusTimerWidgetProps extends WidgetProps {
  accentColor: string
  onSessionComplete: () => void
}

export function FocusTimerWidget({ editMode, onExpand, accentColor, onSessionComplete }: FocusTimerWidgetProps) {
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: number
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false)
      onSessionComplete()
      setTimeLeft(duration * 60)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft, duration, onSessionComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (1 - timeLeft / (duration * 60)) * 100
  const circumference = 2 * Math.PI * 70

  return (
    <div className={`relative rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-5 shadow-xl transition-all duration-200 ${
      editMode ? 'ring-2 ring-sky-400/70 animate-wiggle cursor-move' : 'hover:shadow-2xl hover:-translate-y-1'
    }`}>
      {/* Edit Mode Controls */}
      {editMode && (
        <div className="absolute right-3 top-3 flex items-center gap-2 z-10">
          <button className="px-2 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-slate-400 hover:text-white">
            Resize
          </button>
          <button className="h-5 w-5 rounded-full bg-red-500/90 flex items-center justify-center text-[10px] text-white hover:bg-red-500">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-slate-200">Focus Timer</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/40">
            Pomodoro
          </span>
        </div>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Timer Ring */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <svg width="160" height="160" className="transform -rotate-90">
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="80" cy="80" r="70" fill="none" stroke={accentColor} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-semibold tracking-tight text-slate-100">{formatTime(timeLeft)}</span>
            <span className="text-xs text-slate-500 mt-1">{isRunning ? 'Focusing...' : 'Ready'}</span>
          </div>
        </div>

        {/* Duration Presets */}
        <div className="flex items-center gap-2">
          {[25, 50, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => { setDuration(mins); setTimeLeft(mins * 60); setIsRunning(false) }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                duration === mins
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/60 hover:text-slate-200'
              }`}
              style={duration === mins ? { background: accentColor, boxShadow: `0 4px 15px ${accentColor}50` } : {}}
            >
              {mins}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => { setTimeLeft(duration * 60); setIsRunning(false) }}
            className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2.5 rounded-full text-sm font-medium text-white shadow-lg transition-all hover:scale-105"
            style={{ background: accentColor, boxShadow: `0 8px 25px ${accentColor}40` }}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        </div>
      </div>
    </div>
  )
}

