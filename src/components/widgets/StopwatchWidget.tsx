import { useState } from 'react'
import { Play, Pause, RotateCcw, Flag, Maximize2 } from 'lucide-react'
import type { WidgetProps } from '../../types/widgets'

interface StopwatchWidgetProps extends WidgetProps {
  accentColor: string
}

export function StopwatchWidget({ editMode, onExpand, accentColor }: StopwatchWidgetProps) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])

  useState(() => {
    let interval: number
    if (isRunning) {
      interval = window.setInterval(() => setTime(t => t + 10), 10)
    }
    return () => clearInterval(interval)
  })

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000)
    const secs = Math.floor((ms % 60000) / 1000)
    const centis = Math.floor((ms % 1000) / 10)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`
  }

  const reset = () => {
    setTime(0)
    setIsRunning(false)
    setLaps([])
  }

  const addLap = () => {
    if (isRunning) {
      setLaps([time, ...laps])
    }
  }

  return (
    <div className={`relative rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-5 shadow-xl transition-all duration-200 ${
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-slate-200">Stopwatch</h2>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Time Display */}
      <div className="text-center mb-4">
        <div className="text-4xl font-mono font-semibold text-slate-100 tracking-wide">
          {formatTime(time)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button
          onClick={reset}
          className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-2.5 rounded-full text-sm font-medium text-white shadow-lg transition-all hover:scale-105"
          style={{ 
            background: isRunning ? '#ea580c' : accentColor, 
            boxShadow: `0 8px 25px ${isRunning ? '#ea580c' : accentColor}40` 
          }}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button
          onClick={addLap}
          disabled={!isRunning}
          className="p-2.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Flag size={16} />
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="max-h-[100px] overflow-y-auto space-y-1 custom-scrollbar">
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between text-xs px-3 py-1.5 rounded-lg bg-slate-800/50">
              <span className="text-slate-500">Lap {laps.length - i}</span>
              <span className="text-slate-300 font-mono">{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

