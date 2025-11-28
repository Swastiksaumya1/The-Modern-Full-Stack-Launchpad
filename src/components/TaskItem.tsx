import { useState } from 'react'
import { Check, Trash2, Circle } from 'lucide-react'

type Task = {
  id: string
  text: string
  completed: boolean
}

type Props = {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onExpand?: (id: string) => void
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(task.id), 200)
  }

  return (
    <li
      className={`group flex items-center gap-3 bg-white/5 hover:bg-white/10 text-gray-100 p-4 rounded-xl transition-all duration-300 ${
        isDeleting ? 'opacity-0 scale-95 -translate-x-4' : ''
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          task.completed
            ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-500'
            : 'border-gray-500 hover:border-indigo-400'
        }`}
      >
        {task.completed ? (
          <Check size={14} className="text-white animate-scale-in" />
        ) : (
          <Circle size={14} className="text-transparent group-hover:text-indigo-400/30 transition-colors" />
        )}
      </button>

      {/* Task Text */}
      <span className={`flex-1 transition-all duration-300 ${
        task.completed ? 'line-through text-gray-500' : ''
      }`}>
        {task.text}
      </span>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
        aria-label={`Delete ${task.text}`}
      >
        <Trash2 size={16} />
      </button>
    </li>
  )
}
