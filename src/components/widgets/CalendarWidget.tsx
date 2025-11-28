import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { useState } from 'react'
import type { WidgetProps } from '../../types/widgets'

interface CalendarWidgetProps extends WidgetProps {
  accentColor: string
}

export function CalendarWidget({ editMode, onExpand, accentColor }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1
    return day > 0 && day <= daysInMonth ? day : null
  })

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const isToday = (day: number | null) => {
    if (!day) return false
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }

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
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-sm font-medium text-slate-200">
            {currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-[10px] text-slate-500 font-medium py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            disabled={!day}
            className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-all ${
              !day 
                ? 'invisible' 
                : isToday(day)
                  ? 'text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
            style={isToday(day) ? { background: accentColor } : {}}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

