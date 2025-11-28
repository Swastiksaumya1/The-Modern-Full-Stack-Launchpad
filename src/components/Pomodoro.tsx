import { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Coffee, Briefcase, Zap } from 'lucide-react'

export default function Pomodoro() {
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work')
  const [running, setRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  const workTime = 25 * 60
  const breakTime = 5 * 60

  useEffect(() => {
    let id: number
    if (running && timeLeft > 0) {
      id = window.setInterval(() => setTimeLeft((t) => t - 1), 1000)
    } else if (timeLeft === 0 && running) {
      const isWorkSession = sessionType === 'work'
      if (isWorkSession) {
        setSessionsCompleted((s) => s + 1)
        setSessionType('break')
        setTimeLeft(breakTime)
      } else {
        setSessionType('work')
        setTimeLeft(workTime)
      }
    }
    return () => clearInterval(id)
  }, [running, timeLeft, sessionType])

  function reset() {
    setRunning(false)
    setSessionType('work')
    setTimeLeft(workTime)
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const totalTime = sessionType === 'work' ? workTime : breakTime
  const progress = ((totalTime - timeLeft) / totalTime) * 100
  const circumference = 2 * Math.PI * 90

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Circular Progress */}
      <div className="relative w-52 h-52 mb-6 animate-fade-in">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="104"
            cy="104"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-white/10"
          />
          <circle
            cx="104"
            cy="104"
            r="90"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={`transition-all duration-1000 ${sessionType === 'work' ? 'text-red-500' : 'text-green-500'}`}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - (progress / 100) * circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-4xl mb-1 ${running ? 'animate-pulse' : ''}`}>
            {sessionType === 'work' ? <Briefcase size={32} /> : <Coffee size={32} />}
          </div>
          <div className="text-4xl font-light tracking-wider">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          <div className={`text-xs mt-1 ${sessionType === 'work' ? 'text-red-400' : 'text-green-400'}`}>
            {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6 animate-slide-up">
        <button
          onClick={reset}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg ${
            running
              ? 'bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400'
              : 'bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400'
          }`}
        >
          {running ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <div className="w-12 h-12" /> {/* Spacer for symmetry */}
      </div>

      {/* Session Presets */}
      <div className="flex gap-2 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => { setSessionType('work'); setTimeLeft(workTime); setRunning(false) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            sessionType === 'work' && !running ? 'bg-red-500/30 text-red-300 ring-1 ring-red-500' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          25m Focus
        </button>
        <button
          onClick={() => { setSessionType('break'); setTimeLeft(breakTime); setRunning(false) }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            sessionType === 'break' && !running ? 'bg-green-500/30 text-green-300 ring-1 ring-green-500' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          5m Break
        </button>
      </div>

      {/* Sessions Counter */}
      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
        <Zap size={16} className="text-yellow-400" />
        <span className="text-sm">
          <span className="font-bold text-yellow-400">{sessionsCompleted}</span> sessions completed
        </span>
      </div>
    </div>
  )
}
