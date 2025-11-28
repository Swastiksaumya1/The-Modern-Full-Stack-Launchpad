import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'

type Event = {
  id: string
  title: string
  date: string
  color: string
}

const eventColors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500']

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const raw = localStorage.getItem('focus-calendar-events')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [newEventTitle, setNewEventTitle] = useState('')

  useEffect(() => {
    localStorage.setItem('focus-calendar-events', JSON.stringify(events))
  }, [events])

  const today = new Date()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const dateStr = (day: number) => `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear()

  const getEventsForDay = (day: number) => events.filter(e => e.date === dateStr(day))

  const addEvent = () => {
    if (selectedDate && newEventTitle.trim()) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: newEventTitle.trim(),
        date: selectedDate,
        color: eventColors[Math.floor(Math.random() * eventColors.length)]
      }
      setEvents(e => [...e, newEvent])
      setNewEventTitle('')
    }
  }

  const deleteEvent = (id: string) => {
    setEvents(e => e.filter(ev => ev.id !== id))
  }

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 animate-fade-in">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-semibold text-lg">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-xs font-medium text-center text-gray-500 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 flex-1">
        {blanks.map((i) => (
          <div key={`blank-${i}`} className="aspect-square" />
        ))}
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day)
          const isSelected = selectedDate === dateStr(day)
          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateStr(day))}
              className={`aspect-square text-sm p-1 rounded-lg flex flex-col items-center justify-start transition-all duration-200 hover:scale-105 animate-scale-in ${
                isToday(day)
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                  : isSelected
                    ? 'bg-white/20 ring-1 ring-white/50'
                    : 'hover:bg-white/10'
              }`}
              style={{ animationDelay: `${index * 10}ms` }}
            >
              <span className={`text-xs ${isToday(day) ? 'font-bold' : ''}`}>{day}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map(e => (
                    <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${e.color}`} />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-4 bg-white/5 rounded-xl p-3 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('default', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-white/10 rounded">
              <X size={14} />
            </button>
          </div>

          {/* Events List */}
          <div className="space-y-1 mb-2 max-h-20 overflow-y-auto">
            {getEventsForDay(parseInt(selectedDate.split('-')[2])).map(e => (
              <div key={e.id} className="flex items-center gap-2 text-xs bg-white/5 rounded px-2 py-1">
                <div className={`w-2 h-2 rounded-full ${e.color}`} />
                <span className="flex-1 truncate">{e.title}</span>
                <button onClick={() => deleteEvent(e.id)} className="text-red-400 hover:text-red-300">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Event */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEvent()}
              placeholder="Add event..."
              className="flex-1 bg-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 ring-indigo-500"
            />
            <button
              onClick={addEvent}
              disabled={!newEventTitle.trim()}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
