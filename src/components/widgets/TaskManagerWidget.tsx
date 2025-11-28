import { useState } from 'react'
import { Plus, Check, Trash2, Maximize2, Flag } from 'lucide-react'
import type { Task, WidgetProps } from '../../types/widgets'

interface TaskManagerWidgetProps extends WidgetProps {
  userName: string
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  accentColor: string
}

export function TaskManagerWidget({ 
  editMode, 
  onExpand, 
  userName, 
  tasks, 
  onTasksChange,
  accentColor 
}: TaskManagerWidgetProps) {
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      onTasksChange([...tasks, { id: Date.now().toString(), text: newTask.trim(), completed: false, priority: 'medium' }])
      setNewTask('')
    }
  }

  const toggleTask = (id: string) => {
    onTasksChange(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    onTasksChange(tasks.filter(t => t.id !== id))
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const completedCount = tasks.filter(t => t.completed).length
  const pendingCount = tasks.length - completedCount

  const priorityColors = {
    high: 'text-red-400 bg-red-500/10 border-red-500/30',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  }

  return (
    <section className={`relative rounded-3xl bg-slate-950/90 backdrop-blur-md border border-slate-700/60 p-5 shadow-2xl transition-all duration-200 ${
      editMode ? 'ring-2 ring-sky-400/70 animate-wiggle cursor-move' : ''
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
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-1">Task Manager Pro</p>
          <h2 className="text-lg font-semibold text-slate-100">{getGreeting()}, {userName}.</h2>
          <p className="text-xs text-slate-400 mt-1">
            {pendingCount > 0 ? `You have ${pendingCount} pending task${pendingCount > 1 ? 's' : ''}. Let's crush it.` : 'All tasks completed! 🎉'}
          </p>
        </div>
        {onExpand && (
          <button onClick={onExpand} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={16} />
          </button>
        )}
      </header>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>{completedCount} of {tasks.length} completed</span>
          <span>{tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%`,
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)`
            }}
          />
        </div>
      </div>

      {/* Add Task */}
      <div className="flex gap-2 mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          className="flex-1 rounded-2xl bg-slate-900/80 border border-slate-700 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          placeholder="What needs to be done?"
        />
        <button 
          onClick={addTask}
          className="px-4 py-2.5 rounded-2xl text-sm font-medium text-white transition-all hover:scale-105"
          style={{ background: accentColor }}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <li className="text-center py-8 text-slate-500 text-sm">No tasks yet. Add one above! ✨</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between rounded-2xl bg-slate-900/70 border border-slate-800 px-4 py-3 group transition-all hover:border-slate-700 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'border-emerald-500 bg-emerald-500 text-white' 
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  {task.completed && <Check size={12} />}
                </button>
                <span className={`text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {task.priority && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                    <Flag size={10} className="inline mr-1" />
                    {task.priority}
                  </span>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  )
}

