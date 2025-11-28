import { useState } from 'react'
import { 
  LayoutGrid, Timer, Calendar, BarChart3, Settings, 
  Music, StickyNote, Target, Calculator 
} from 'lucide-react'
import type { WidgetType } from '../../types/widgets'

interface DockProps {
  onNavigate: (widget: WidgetType | 'settings') => void
  editMode: boolean
  onToggleEditMode: () => void
  accentColor: string
}

export function Dock({ onNavigate, editMode, onToggleEditMode, accentColor }: DockProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const dockItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', color: accentColor },
    { id: 'focus', icon: Timer, label: 'Focus', color: '#22c55e' },
    { id: 'tasks', icon: Target, label: 'Tasks', color: '#f97316' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', color: '#ec4899' },
    { id: 'notes', icon: StickyNote, label: 'Notes', color: '#eab308' },
    { id: 'music', icon: Music, label: 'Music', color: '#8b5cf6' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', color: '#06b6d4' },
    { id: 'calculator', icon: Calculator, label: 'Calculator', color: '#64748b' },
    { id: 'settings', icon: Settings, label: 'Settings', color: '#94a3b8' },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-end gap-1 px-3 py-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 shadow-[0_18px_45px_rgba(15,23,42,0.65)]">
        {dockItems.map((item) => {
          const isHovered = hoveredItem === item.id
          const Icon = item.icon
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as WidgetType | 'settings')}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative flex flex-col items-center group"
              title={item.label}
            >
              {/* Tooltip */}
              <div 
                className={`absolute -top-10 px-2 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 whitespace-nowrap transition-all duration-200 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                {item.label}
              </div>

              {/* Icon Container */}
              <div
                className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
                  isHovered 
                    ? 'scale-125 -translate-y-3' 
                    : 'scale-100 translate-y-0'
                }`}
                style={{
                  background: isHovered ? item.color : 'rgba(255,255,255,0.06)',
                  boxShadow: isHovered ? `0 8px 25px ${item.color}60` : 'none'
                }}
              >
                <Icon size={20} className={isHovered ? 'text-white' : 'text-slate-400'} />
              </div>

              {/* Active dot */}
              {item.id === 'dashboard' && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          )
        })}

        {/* Separator */}
        <div className="w-px h-8 bg-slate-700/60 mx-1" />

        {/* Edit Mode Toggle */}
        <button
          onClick={onToggleEditMode}
          className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
            editMode 
              ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' 
              : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700/80'
          }`}
        >
          {editMode ? 'Done' : 'Edit'}
        </button>
      </div>
    </div>
  )
}

