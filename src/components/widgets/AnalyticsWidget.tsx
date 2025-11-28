import { TrendingUp, Target, Clock, Zap, Maximize2 } from 'lucide-react'
import type { WidgetProps } from '../../types/widgets'

interface AnalyticsWidgetProps extends WidgetProps {
  tasksCompleted: number
  focusSessions: number
  focusTime: number
  accentColor: string
}

export function AnalyticsWidget({ 
  editMode, 
  onExpand, 
  tasksCompleted, 
  focusSessions, 
  focusTime,
  accentColor 
}: AnalyticsWidgetProps) {
  // Mock weekly data
  const weeklyData = [65, 45, 80, 55, 90, 70, 85]
  const maxValue = Math.max(...weeklyData)
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  const stats = [
    { icon: Target, label: 'Tasks Done', value: tasksCompleted, color: 'text-emerald-400' },
    { icon: Zap, label: 'Focus Sessions', value: focusSessions, color: 'text-amber-400' },
    { icon: Clock, label: 'Focus Hours', value: `${focusTime}h`, color: 'text-sky-400' },
    { icon: TrendingUp, label: 'Productivity', value: '78%', color: 'text-violet-400' },
  ]

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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-slate-200">Analytics</h2>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon size={14} className={stat.color} />
              <span className="text-[10px] text-slate-500">{stat.label}</span>
            </div>
            <span className="text-lg font-semibold text-slate-200">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div>
        <p className="text-xs text-slate-500 mb-2">This Week</p>
        <div className="flex items-end justify-between gap-1 h-16">
          {weeklyData.map((value, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full rounded-t-lg transition-all"
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  background: i === 6 ? accentColor : 'rgba(255,255,255,0.1)'
                }}
              />
              <span className="text-[10px] text-slate-500">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

