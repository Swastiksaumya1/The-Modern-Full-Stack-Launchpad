import { useState, useEffect, useRef } from 'react'
import { Clock, Play, Pause, RotateCcw, Flag } from 'lucide-react'

export default function StopwatchWidget() {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    let interval: number
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsed
      interval = window.setInterval(() => {
        setElapsed(Date.now() - (startTimeRef.current ?? Date.now()))
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      centiseconds: String(centiseconds).padStart(2, '0'),
    }
  }

  const time = formatTime(elapsed)

  const toggle = () => setIsRunning(!isRunning)
  
  const reset = () => {
    setIsRunning(false)
    setElapsed(0)
    setLaps([])
    startTimeRef.current = null
  }

  const addLap = () => {
    if (isRunning) {
      setLaps(prev => [elapsed, ...prev])
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <Clock size={16} />
        <span className="text-sm font-medium tracking-wide">STOPWATCH</span>
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-light tracking-wider">{time.minutes}</span>
          <span className="text-2xl text-gray-500">:</span>
          <span className="text-4xl font-light tracking-wider">{time.seconds}</span>
          <span className="text-xl text-gray-500">.{time.centiseconds}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            disabled={elapsed === 0}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            <RotateCcw size={16} />
          </button>
          
          <button
            onClick={toggle}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isRunning
                ? 'bg-orange-600 hover:bg-orange-500'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            onClick={addLap}
            disabled={!isRunning}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            <Flag size={16} />
          </button>
        </div>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="mt-4 max-h-20 overflow-y-auto space-y-1">
          {laps.slice(0, 3).map((lap, i) => {
            const t = formatTime(lap)
            return (
              <div key={i} className="flex justify-between text-xs text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg">
                <span>Lap {laps.length - i}</span>
                <span>{t.minutes}:{t.seconds}.{t.centiseconds}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

