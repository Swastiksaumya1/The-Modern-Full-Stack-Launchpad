import { useState, useEffect } from 'react'
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Heart, Music } from 'lucide-react'

type Track = {
  id: string
  title: string
  artist: string
  duration: number
  cover: string
}

const defaultPlaylist: Track[] = [
  { id: '1', title: 'Focus Beats', artist: 'Lo-Fi Chill', duration: 180, cover: '🎵' },
  { id: '2', title: 'Deep Work', artist: 'Ambient Music', duration: 240, cover: '🎹' },
  { id: '3', title: 'Morning Vibes', artist: 'Soft Piano', duration: 210, cover: '☀️' },
  { id: '4', title: 'Night Owl', artist: 'Electronic', duration: 195, cover: '🌙' },
  { id: '5', title: 'Coffee Shop', artist: 'Jazz Beats', duration: 225, cover: '☕' },
]

export default function MusicPlayer() {
  const [playlist] = useState<Track[]>(defaultPlaylist)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [elapsed, setElapsed] = useState(0)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [liked, setLiked] = useState<Set<string>>(new Set())

  useEffect(() => {
    let id: number
    if (playing) {
      id = window.setInterval(() => {
        setElapsed((e) => {
          const next = e + 1
          if (next >= playlist[currentIdx].duration) {
            if (repeat) return 0
            if (shuffle) {
              setCurrentIdx(Math.floor(Math.random() * playlist.length))
            } else {
              setCurrentIdx((i) => (i + 1) % playlist.length)
            }
            return 0
          }
          return next
        })
      }, 1000)
    }
    return () => clearInterval(id)
  }, [playing, currentIdx, playlist, shuffle, repeat])

  const current = playlist[currentIdx]
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const progress = (elapsed / current.duration) * 100

  const toggleLike = (id: string) => {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950">
      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative animate-fade-in">
          <div className={`w-40 h-40 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl shadow-2xl shadow-purple-500/30 ${playing ? 'animate-pulse' : ''}`}>
            {current.cover}
          </div>
          {playing && (
            <div className="absolute -inset-4 rounded-3xl bg-purple-500/20 blur-xl -z-10 animate-pulse" />
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="px-6 text-center animate-slide-up">
        <h2 className="text-xl font-semibold truncate">{current.title}</h2>
        <p className="text-gray-400 text-sm">{current.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mt-4 animate-slide-up" style={{ animationDelay: '50ms' }}>
        <div
          className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const pct = (e.clientX - rect.left) / rect.width
            setElapsed(Math.floor(pct * current.duration))
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(elapsed)}</span>
          <span>{formatTime(current.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <button
          onClick={() => setShuffle(!shuffle)}
          className={`p-2 rounded-full transition-colors ${shuffle ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
        >
          <Shuffle size={18} />
        </button>
        <button
          onClick={() => { setCurrentIdx((i) => (i - 1 + playlist.length) % playlist.length); setElapsed(0) }}
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-purple-500/30"
        >
          {playing ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
        </button>
        <button
          onClick={() => { setCurrentIdx((i) => (i + 1) % playlist.length); setElapsed(0) }}
          className="p-2 text-gray-300 hover:text-white transition-colors"
        >
          <SkipForward size={24} />
        </button>
        <button
          onClick={() => setRepeat(!repeat)}
          className={`p-2 rounded-full transition-colors ${repeat ? 'text-purple-400' : 'text-gray-500 hover:text-white'}`}
        >
          <Repeat size={18} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 px-6 pb-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <button onClick={() => setVolume(v => v === 0 ? 70 : 0)} className="text-gray-400 hover:text-white">
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        <span className="text-xs text-gray-500 w-8">{volume}%</span>
      </div>

      {/* Playlist */}
      <div className="border-t border-white/10 max-h-32 overflow-y-auto">
        {playlist.map((track, i) => (
          <div
            key={track.id}
            onClick={() => { setCurrentIdx(i); setElapsed(0); setPlaying(true) }}
            className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
              i === currentIdx ? 'bg-purple-500/20' : 'hover:bg-white/5'
            }`}
          >
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-sm">
              {i === currentIdx && playing ? <Music size={14} className="animate-pulse" /> : track.cover}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{track.title}</p>
              <p className="text-xs text-gray-500">{track.artist}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleLike(track.id) }}
              className={`p-1 transition-colors ${liked.has(track.id) ? 'text-pink-500' : 'text-gray-600 hover:text-pink-400'}`}
            >
              <Heart size={14} fill={liked.has(track.id) ? 'currentColor' : 'none'} />
            </button>
            <span className="text-xs text-gray-500">{formatTime(track.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
