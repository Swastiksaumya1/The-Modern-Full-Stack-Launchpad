import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    return { daysInMonth, startingDay }
  }

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate)

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Sample events
  const events: { [key: number]: string } = {
    [today.getDate()]: 'blue',
    [today.getDate() + 2]: 'green',
    [today.getDate() + 5]: 'pink',
    [15]: 'purple',
  }

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={16} />
          <span className="text-sm font-medium">{monthName}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {/* Empty cells for start */}
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const isToday = day === today.getDate() && 
            currentDate.getMonth() === today.getMonth() && 
            currentDate.getFullYear() === today.getFullYear()
          const eventColor = events[day]

          return (
            <button
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative transition-colors ${
                isToday 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-white/10'
              }`}
            >
              {day}
              {eventColor && (
                <div className={`absolute bottom-1 w-1 h-1 rounded-full bg-${eventColor}-400`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

