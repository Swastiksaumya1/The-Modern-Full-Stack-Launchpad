import { useState, useEffect } from 'react'
import { Timer, Play, Pause, RotateCcw } from 'lucide-react'

export default function FocusTimerWidget() {
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: number
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft(t => t - 1), 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      // Could add notification here
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const presets = [
    { label: '25', value: 25 },
    { label: '5', value: 5 },
    { label: '15', value: 15 },
  ]

  const selectDuration = (mins: number) => {
    if (!isRunning) {
      setDuration(mins)
      setTimeLeft(mins * 60)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration * 60)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <Timer size={16} />
        <span className="text-sm font-medium tracking-wide">FOCUS TIMER</span>
      </div>

      {/* Duration Presets */}
      <div className="flex gap-2 mb-4">
        {presets.map(preset => (
          <button
            key={preset.value}
            onClick={() => selectDuration(preset.value)}
            disabled={isRunning}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              duration === preset.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-800"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              className="text-blue-500 transition-all duration-1000"
              style={{
                strokeDasharray: 2 * Math.PI * 58,
                strokeDashoffset: 2 * Math.PI * 58 * (1 - progress / 100),
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-light tracking-wider">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={toggleTimer}
        className={`w-full py-3 rounded-xl font-medium text-sm tracking-wide transition-all ${
          isRunning
            ? 'bg-orange-600 hover:bg-orange-500'
            : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        {isRunning ? (
          <span className="flex items-center justify-center gap-2">
            <Pause size={16} /> PAUSE
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Play size={16} /> START FOCUS
          </span>
        )}
      </button>

      {isRunning && (
        <button
          onClick={resetTimer}
          className="mt-2 w-full py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={14} /> Reset
        </button>
      )}
    </div>
  )
}

