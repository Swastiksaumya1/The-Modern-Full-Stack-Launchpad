import { useState } from 'react'
import { LayoutGrid, CheckSquare, Clock, Settings, Music, Calendar, BarChart3, FileText, Cloud } from 'lucide-react'

type DockItem = {
  id: string
  icon: React.ElementType
  label: string
  color: string
}

type Props = {
  activeView: string
  onChangeView: (view: string) => void
  onOpenApp: (app: string) => void
}

const dockItems: DockItem[] = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', color: 'from-blue-500 to-indigo-600' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks', color: 'from-green-500 to-emerald-600' },
  { id: 'focus', icon: Clock, label: 'Focus', color: 'from-orange-500 to-red-600' },
  { id: 'settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-slate-600' },
]

const additionalApps: DockItem[] = [
  { id: 'music', icon: Music, label: 'Music', color: 'from-pink-500 to-purple-600' },
  { id: 'calendar', icon: Calendar, label: 'Calendar', color: 'from-red-500 to-pink-600' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'from-cyan-500 to-blue-600' },
  { id: 'notes', icon: FileText, label: 'Notes', color: 'from-yellow-500 to-orange-600' },
  { id: 'weather', icon: Cloud, label: 'Weather', color: 'from-sky-400 to-blue-500' },
]

export default function Dock({ activeView, onChangeView, onOpenApp }: Props) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const renderDockItem = (item: DockItem, isMainNav: boolean = false) => {
    const isActive = activeView === item.id
    const isHovered = hoveredItem === item.id

    return (
      <div 
        key={item.id}
        className="relative group"
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Tooltip */}
        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 rounded-lg text-xs whitespace-nowrap transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          {item.label}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
        </div>

        <button
          onClick={() => isMainNav ? onChangeView(item.id) : onOpenApp(item.id)}
          className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isActive 
              ? `bg-gradient-to-br ${item.color} shadow-lg shadow-${item.color.split('-')[1]}-500/30`
              : 'bg-white/10 hover:bg-white/20'
          } ${isHovered ? 'scale-125 -translate-y-2' : ''}`}
        >
          <item.icon size={22} className="text-white" />
        </button>

        {/* Active Indicator */}
        {isActive && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="flex items-center gap-2 px-4 py-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
        {/* Main Navigation */}
        {dockItems.map(item => renderDockItem(item, true))}

        {/* Divider */}
        <div className="w-px h-8 bg-white/20 mx-2" />

        {/* Additional Apps */}
        {additionalApps.map(item => renderDockItem(item, false))}
      </div>
    </div>
  )
}

