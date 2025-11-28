import { useState, useEffect } from 'react'
import { CheckSquare, Plus, Maximize2, Check, Trash2 } from 'lucide-react'

type Task = {
  id: string
  text: string
  completed: boolean
}

type Props = {
  userName: string
}

export default function TaskWidget({ userName }: Props) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem('focus-dashboard-tasks')
      return raw ? JSON.parse(raw) : [
        { id: '1', text: 'Welcome to FocusOS 1.0', completed: false },
        { id: '2', text: 'Add your first task below', completed: false },
      ]
    } catch {
      return []
    }
  })
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    localStorage.setItem('focus-dashboard-tasks', JSON.stringify(tasks))
  }, [tasks])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const pendingCount = tasks.filter(t => !t.completed).length

  const addTask = () => {
    if (newTask.trim()) {
      setTasks(prev => [...prev, { id: Date.now().toString(), text: newTask.trim(), completed: false }])
      setNewTask('')
    }
  }

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-blue-400">
          <CheckSquare size={18} />
          <span className="font-medium">Task Manager Pro</span>
        </div>
        <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <Maximize2 size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Greeting */}
      <div className="p-4 pb-2">
        <h2 className="text-2xl font-semibold">{getGreeting()}, {userName}.</h2>
        <p className="text-gray-400 text-sm mt-1">
          You have {pendingCount} pending task{pendingCount !== 1 ? 's' : ''}. Stay focused.
        </p>
      </div>

      {/* Add Task Input */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-3 bg-gray-800/50 rounded-xl px-4 py-3 border border-white/5 focus-within:border-blue-500/50 transition-colors">
          <Plus size={18} className="text-gray-500" />
          <input
            type="text"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="px-3 py-1 text-xs font-medium bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            ENTER
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5 animate-slide-up ${
              task.completed ? 'opacity-50' : ''
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                task.completed 
                  ? 'bg-blue-500 border-blue-500' 
                  : 'border-gray-600 hover:border-blue-400'
              }`}
            >
              {task.completed && <Check size={12} className="text-white" />}
            </button>
            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.text}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

