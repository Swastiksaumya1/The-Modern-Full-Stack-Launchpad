import { useState } from 'react'
import { ChevronUp, Palette, Layout, User } from 'lucide-react'
import type { AccentColor, Wallpaper } from '../../types/widgets'

interface BottomSheetProps {
  userName: string
  onUserNameChange: (name: string) => void
  city: string
  onCityChange: (city: string) => void
  accentColors: AccentColor[]
  selectedAccent: string
  onAccentChange: (id: string) => void
  wallpapers: Wallpaper[]
  selectedWallpaper: string
  onWallpaperChange: (id: string) => void
}

export function BottomSheet({
  userName,
  onUserNameChange,
  city,
  onCityChange,
  accentColors,
  selectedAccent,
  onAccentChange,
  wallpapers,
  selectedWallpaper,
  onWallpaperChange
}: BottomSheetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
      }`}
    >
      <div className="mx-auto w-full max-w-4xl rounded-t-3xl bg-slate-900/95 backdrop-blur-xl border-t border-x border-slate-700/60 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
        {/* Handle & Toggle */}
        <button
          className="w-full flex flex-col items-center gap-2 py-4 cursor-pointer group"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="h-1.5 w-16 rounded-full bg-slate-600 group-hover:bg-slate-500 transition-colors" />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ChevronUp 
              size={14} 
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
            <span>{isOpen ? 'Tap to collapse' : 'Swipe up to customize'}</span>
          </div>
        </button>

        {/* Content */}
        <div className="px-6 pb-8 grid gap-6 md:grid-cols-2">
          {/* Profile Section */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100 mb-4">
              <User size={16} className="text-sky-400" />
              Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => onUserNameChange(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  placeholder="Your city"
                />
              </div>
            </div>
          </section>

          {/* Theme Section */}
          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100 mb-4">
              <Palette size={16} className="text-violet-400" />
              Accent Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onAccentChange(color.id)}
                  className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 ${
                    selectedAccent === color.id 
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' 
                      : ''
                  }`}
                  style={{ background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})` }}
                />
              ))}
            </div>
          </section>

          {/* Wallpaper Section */}
          <section className="md:col-span-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100 mb-4">
              <Layout size={16} className="text-emerald-400" />
              Wallpaper
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {wallpapers.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => onWallpaperChange(wp.id)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                    selectedWallpaper === wp.id 
                      ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-900' 
                      : ''
                  }`}
                  style={{ background: wp.preview }}
                >
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] text-white/80 text-center truncate">
                    {wp.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

