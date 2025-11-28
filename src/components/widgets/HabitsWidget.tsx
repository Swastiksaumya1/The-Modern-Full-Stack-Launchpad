import { Check, Maximize2 } from 'lucide-react'
import type { Habit, WidgetProps } from '../../types/widgets'

interface HabitsWidgetProps extends WidgetProps {
  habits: Habit[]
  onHabitsChange: (habits: Habit[]) => void
  accentColor: string
}

export function HabitsWidget({ editMode, onExpand, habits, onHabitsChange, accentColor }: HabitsWidgetProps) {
  const toggleHabit = (id: string) => {
    onHabitsChange(habits.map(h => 
      h.id === id 
        ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak : h.streak + 1 } 
        : h
    ))
  }

  const completedCount = habits.filter(h => h.completedToday).length

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
        <div>
          <h2 className="text-sm font-medium text-slate-200">Daily Habits</h2>
          <p className="text-xs text-slate-500">{completedCount}/{habits.length} completed</p>
        </div>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Habits List */}
      <div className="space-y-2">
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all ${
              habit.completedToday 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{habit.icon}</span>
              <span className={`text-sm ${habit.completedToday ? 'text-emerald-300' : 'text-slate-300'}`}>
                {habit.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">🔥 {habit.streak}</span>
              <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                habit.completedToday 
                  ? 'border-emerald-500 bg-emerald-500 text-white' 
                  : 'border-slate-600'
              }`}>
                {habit.completedToday && <Check size={12} />}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${habits.length > 0 ? (completedCount / habits.length) * 100 : 0}%`,
            background: accentColor
          }}
        />
      </div>
    </div>
  )
}

