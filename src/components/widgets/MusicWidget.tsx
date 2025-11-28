import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2 } from 'lucide-react'
import type { WidgetProps } from '../../types/widgets'

interface MusicWidgetProps extends WidgetProps {
  accentColor: string
}

const TRACKS = [
  { title: 'Lofi Study Beats', artist: 'ChillHop', duration: '3:45', cover: '🎵' },
  { title: 'Deep Focus', artist: 'Brain.fm', duration: '4:20', cover: '🎧' },
  { title: 'Ambient Flow', artist: 'Endel', duration: '5:30', cover: '🌊' },
  { title: 'Piano Dreams', artist: 'Peaceful Piano', duration: '4:15', cover: '🎹' },
]

export function MusicWidget({ editMode, onExpand, accentColor }: MusicWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress] = useState(35)

  const track = TRACKS[currentTrack]

  const nextTrack = () => setCurrentTrack((c) => (c + 1) % TRACKS.length)
  const prevTrack = () => setCurrentTrack((c) => (c - 1 + TRACKS.length) % TRACKS.length)

  return (
    <div className={`relative rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-4 shadow-xl transition-all duration-200 ${
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
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-slate-200">Music</h2>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Now Playing */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)` }}
        >
          {track.cover}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">{track.title}</p>
          <p className="text-xs text-slate-500 truncate">{track.artist}</p>
        </div>
        <Volume2 size={16} className="text-slate-500" />
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: accentColor }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>1:18</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button 
          onClick={prevTrack}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <SkipBack size={18} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full text-white shadow-lg transition-all hover:scale-105"
          style={{ background: accentColor, boxShadow: `0 6px 20px ${accentColor}40` }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <button 
          onClick={nextTrack}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  )
}

