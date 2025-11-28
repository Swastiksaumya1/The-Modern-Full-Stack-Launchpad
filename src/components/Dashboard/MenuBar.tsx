import { useState, useEffect } from 'react'
import { Wifi, Battery, Volume2, User } from 'lucide-react'

type Props = {
  userName: string
  onOpenSettings: () => void
}

export default function MenuBar({ userName, onOpenSettings }: Props) {
  const [time, setTime] = useState(new Date())
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const menus = [
    { id: 'file', label: 'File', items: ['New Window', 'New Tab', 'Save', 'Export', 'Exit'] },
    { id: 'view', label: 'View', items: ['Dashboard', 'Focus Mode', 'Compact', 'Full Screen'] },
    { id: 'window', label: 'Window', items: ['Minimize', 'Maximize', 'Close All', 'Tile Windows'] },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 h-10 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-50">
      {/* Left - Logo & Menus */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-blue-400 font-semibold">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center text-[10px]">
            ⊞
          </div>
          <span className="text-sm">FocusOS</span>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <nav className="flex items-center gap-1">
          {menus.map(menu => (
            <div key={menu.id} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  activeMenu === menu.id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {menu.label}
              </button>
              
              {activeMenu === menu.id && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setActiveMenu(null)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-48 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-xl py-1 z-50 animate-fade-in">
                    {menu.items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveMenu(null)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right - System Tray */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-gray-400">
          <Wifi size={14} />
          <Volume2 size={14} />
          <div className="flex items-center gap-1">
            <Battery size={14} />
            <span className="text-xs">100%</span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <div className="text-xs text-gray-300">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <button 
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User size={12} />
          </div>
          <span className="text-sm">{userName}</span>
        </button>
      </div>
    </header>
  )
}

