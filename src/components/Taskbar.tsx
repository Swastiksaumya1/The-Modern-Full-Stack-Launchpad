import { useState, useEffect } from 'react'
import { Search, Power, Grid3X3 } from 'lucide-react'
import type { WindowType } from './Window'

type WindowState = {
  type: WindowType
  id: string
  title: string
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

type Props = {
  onOpenWindow: (type: WindowType) => void
  windows: WindowState[]
  onRestoreWindow: (id: string) => void
  showStartMenu: boolean
  setShowStartMenu: (show: boolean) => void
}

const apps: { type: WindowType; label: string; icon: string; color: string }[] = [
  { type: 'tasks', label: 'Tasks', icon: '📋', color: 'from-blue-500 to-cyan-500' },
  { type: 'notes', label: 'Notes', icon: '📝', color: 'from-yellow-500 to-orange-500' },
  { type: 'calculator', label: 'Calculator', icon: '🧮', color: 'from-purple-500 to-pink-500' },
  { type: 'calendar', label: 'Calendar', icon: '📅', color: 'from-red-500 to-pink-500' },
  { type: 'analytics', label: 'Analytics', icon: '📊', color: 'from-green-500 to-emerald-500' },
  { type: 'music', label: 'Music', icon: '🎵', color: 'from-fuchsia-500 to-purple-500' },
  { type: 'pomodoro', label: 'Pomodoro', icon: '🍅', color: 'from-red-500 to-orange-500' },
  { type: 'clock', label: 'Clock', icon: '🕐', color: 'from-slate-500 to-gray-500' },
  { type: 'stopwatch', label: 'Stopwatch', icon: '⏱️', color: 'from-teal-500 to-cyan-500' },
  { type: 'timer', label: 'Timer', icon: '⏲️', color: 'from-amber-500 to-yellow-500' },
  { type: 'weather', label: 'Weather', icon: '🌤️', color: 'from-sky-500 to-blue-500' },
  { type: 'settings', label: 'Settings', icon: '⚙️', color: 'from-gray-500 to-slate-500' },
  { type: 'filemanager', label: 'Files', icon: '📁', color: 'from-amber-500 to-yellow-500' },
]

export default function Taskbar({ onOpenWindow, windows, onRestoreWindow, showStartMenu, setShowStartMenu }: Props) {
  const [time, setTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const filteredApps = apps.filter(app =>
    app.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter windows for potential future use
  void windows.filter(w => !w.isMinimized)
  void windows.filter(w => w.isMinimized)

  return (
    <>
      {/* Start Menu */}
      {showStartMenu && (
        <div
          className="fixed bottom-16 left-2 w-80 glass rounded-2xl shadow-2xl z-50 animate-slide-up overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 text-sm outline-none placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Apps Grid */}
          <div className="p-4 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-4 gap-3">
              {filteredApps.map((app, i) => (
                <button
                  key={app.type}
                  onClick={() => { onOpenWindow(app.type); setShowStartMenu(false); setSearchQuery('') }}
                  className="flex flex-col items-center p-2 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-110 animate-scale-in"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center text-lg shadow-md`}>
                    {app.icon}
                  </div>
                  <span className="text-[10px] mt-1 text-gray-300">{app.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Power */}
          <div className="p-3 border-t border-white/10 flex justify-end">
            <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
              <Power size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-14 glass border-t border-white/10 flex items-center px-2 z-40 animate-taskbar">
        {/* Start Button */}
        <button
          onClick={() => setShowStartMenu(!showStartMenu)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 ${
            showStartMenu ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <Grid3X3 size={20} className="text-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/20 mx-2" />

        {/* Open Windows */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto px-1">
          {windows.map((win) => {
            const app = apps.find(a => a.type === win.type)
            return (
              <button
                key={win.id}
                onClick={() => win.isMinimized ? onRestoreWindow(win.id) : null}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-0 ${
                  win.isMinimized
                    ? 'bg-white/5 hover:bg-white/10 opacity-60'
                    : 'bg-white/15 hover:bg-white/20'
                }`}
              >
                <span className="text-sm">{app?.icon}</span>
                <span className="text-xs truncate max-w-20 hidden sm:block">{app?.label}</span>
                {!win.isMinimized && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-indigo-400 rounded-full" />
                )}
              </button>
            )
          })}
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-3 px-3">
          {/* Quick Apps */}
          <div className="hidden md:flex items-center gap-1">
            {['weather', 'settings'].map(type => {
              const app = apps.find(a => a.type === type)
              return (
                <button
                  key={type}
                  onClick={() => onOpenWindow(type as WindowType)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm">{app?.icon}</span>
                </button>
              )
            })}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20" />

          {/* Clock */}
          <div className="text-right">
            <div className="text-xs font-medium">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-[10px] text-gray-400">
              {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close start menu */}
      {showStartMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowStartMenu(false)}
        />
      )}
    </>
  )
}
