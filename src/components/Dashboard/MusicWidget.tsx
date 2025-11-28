import { useState, useEffect } from 'react'
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react'

const tracks = [
  { title: 'Lo-Fi Beats', artist: 'ChillHop', duration: '3:42', cover: '🎵' },
  { title: 'Focus Flow', artist: 'Ambient Works', duration: '4:15', cover: '🎹' },
  { title: 'Deep Focus', artist: 'Brain.fm', duration: '5:30', cover: '🧠' },
  { title: 'Nature Sounds', artist: 'Relaxation', duration: '10:00', cover: '🌿' },
]

export default function MusicWidget() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [liked, setLiked] = useState<number[]>([])

  const track = tracks[currentTrack]

  useEffect(() => {
    let interval: number
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            nextTrack()
            return 0
          }
          return p + 0.5
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const nextTrack = () => {
    setCurrentTrack(c => (c + 1) % tracks.length)
    setProgress(0)
  }

  const prevTrack = () => {
    setCurrentTrack(c => (c - 1 + tracks.length) % tracks.length)
    setProgress(0)
  }

  const toggleLike = () => {
    setLiked(prev => 
      prev.includes(currentTrack) 
        ? prev.filter(i => i !== currentTrack)
        : [...prev, currentTrack]
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 text-gray-400 border-b border-white/10">
        <Music size={16} />
        <span className="text-sm font-medium">Now Playing</span>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl mb-4 ${isPlaying ? 'animate-pulse' : ''}`}>
          {track.cover}
        </div>
        
        <div className="text-center mb-2">
          <h3 className="font-medium">{track.title}</h3>
          <p className="text-sm text-gray-400">{track.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={prevTrack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <SkipBack size={18} />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>
          <button onClick={nextTrack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <SkipForward size={18} />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between p-4 border-t border-white/10">
        <button 
          onClick={toggleLike}
          className={`p-2 rounded-full transition-colors ${liked.includes(currentTrack) ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
        >
          <Heart size={18} fill={liked.includes(currentTrack) ? 'currentColor' : 'none'} />
        </button>
        <Volume2 size={18} className="text-gray-400" />
      </div>
    </div>
  )
}

