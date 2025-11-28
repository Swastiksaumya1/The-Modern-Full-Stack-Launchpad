import { useState } from 'react'
import type { WindowType } from './Window'

type Props = {
  onOpenWindow: (type: WindowType) => void
}

const desktopApps: { type: WindowType; label: string; icon: string; color: string }[] = [
  { type: 'tasks', label: 'Tasks', icon: '📋', color: 'from-blue-500 to-cyan-500' },
  { type: 'notes', label: 'Notes', icon: '📝', color: 'from-yellow-500 to-orange-500' },
  { type: 'calculator', label: 'Calculator', icon: '🧮', color: 'from-purple-500 to-pink-500' },
  { type: 'calendar', label: 'Calendar', icon: '📅', color: 'from-red-500 to-pink-500' },
  { type: 'weather', label: 'Weather', icon: '🌤️', color: 'from-sky-500 to-blue-500' },
  { type: 'filemanager', label: 'Files', icon: '📁', color: 'from-amber-500 to-yellow-500' },
]

export default function DesktopIcons({ onOpenWindow }: Props) {
  const [activeIcon, setActiveIcon] = useState<string | null>(null)

  const handleClick = (type: WindowType) => {
    setActiveIcon(type)
    setTimeout(() => setActiveIcon(null), 200)
    onOpenWindow(type)
  }

  return (
    <div className="fixed top-4 left-4 z-10 grid grid-cols-1 gap-4">
      {desktopApps.map((app, index) => (
        <button
          key={app.type}
          onClick={() => handleClick(app.type)}
          className={`group flex flex-col items-center p-3 rounded-xl transition-all duration-300 hover:bg-white/10 animate-fade-in ${
            activeIcon === app.type ? 'animate-icon-bounce scale-90' : 'hover:scale-110'
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
            {app.icon}
          </div>
          <span className="text-xs mt-2 text-white/80 group-hover:text-white font-medium drop-shadow-lg">
            {app.label}
          </span>
        </button>
      ))}
    </div>
  )
}

