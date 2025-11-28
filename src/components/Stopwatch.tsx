import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Flag } from 'lucide-react'

export default function Stopwatch() {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    let id: number | undefined
    if (running) {
      startRef.current = performance.now() - elapsed
      id = window.setInterval(() => setElapsed(performance.now() - (startRef.current ?? 0)), 10)
    }
    return () => { if (id) clearInterval(id) }
  }, [running])

  function toggle() {
    setRunning((r) => !r)
  }

  function reset() {
    setRunning(false)
    setElapsed(0)
    setLaps([])
    startRef.current = null
  }

  function addLap() {
    if (running) {
      setLaps(l => [elapsed, ...l])
    }
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const seconds = Math.floor((ms / 1000) % 60)
    const centiseconds = Math.floor((ms % 1000) / 10)
    return { minutes, seconds, centiseconds }
  }

  const time = formatTime(elapsed)

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-teal-900/30 to-slate-900">
      {/* Display */}
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-6xl font-light tracking-wider tabular-nums">
            {String(time.minutes).padStart(2, '0')}
          </span>
          <span className="text-4xl text-teal-400">:</span>
          <span className="text-6xl font-light tracking-wider tabular-nums">
            {String(time.seconds).padStart(2, '0')}
          </span>
          <span className="text-2xl text-gray-500 ml-1">
            .{String(time.centiseconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6 animate-slide-up">
        <button
          onClick={reset}
          disabled={elapsed === 0}
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <RotateCcw size={22} />
        </button>
        <button
          onClick={toggle}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg ${
            running
              ? 'bg-gradient-to-br from-orange-500 to-red-500'
              : 'bg-gradient-to-br from-teal-500 to-cyan-500'
          }`}
        >
          {running ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>
        <button
          onClick={addLap}
          disabled={!running}
          className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 flex items-center justify-center transition-all duration-200 hover:scale-110"
        >
          <Flag size={22} />
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="w-full max-h-40 overflow-y-auto bg-white/5 rounded-xl p-3 animate-slide-up">
          <div className="text-xs text-gray-500 mb-2">Laps</div>
          {laps.map((lap, i) => {
            const t = formatTime(lap)
            const diff = i < laps.length - 1 ? lap - laps[i + 1] : lap
            const d = formatTime(diff)
            return (
              <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0 text-sm animate-slide-up" style={{ animationDelay: `${i * 30}ms` }}>
                <span className="text-gray-400">Lap {laps.length - i}</span>
                <span className="text-teal-400">+{String(d.minutes).padStart(2, '0')}:{String(d.seconds).padStart(2, '0')}.{String(d.centiseconds).padStart(2, '0')}</span>
                <span>{String(t.minutes).padStart(2, '0')}:{String(t.seconds).padStart(2, '0')}.{String(t.centiseconds).padStart(2, '0')}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
