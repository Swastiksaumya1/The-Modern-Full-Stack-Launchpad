

type Task = {
  id: string
  text: string
  completed: boolean
}

type Props = {
  task: Task
  onClose: () => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function FullscreenTask({ task, onClose, onToggle, onDelete }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gray-900 text-gray-100 w-full max-w-4xl h-full md:h-4/5 rounded p-6 overflow-auto">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold">{task.text}</h2>
            <p className="text-sm text-gray-400">Task ID: {task.id}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onToggle(task.id)} className="px-3 py-1 bg-blue-600 rounded">{task.completed ? 'Mark Open' : 'Mark Done'}</button>
            <button onClick={() => onDelete(task.id)} className="px-3 py-1 bg-red-600 rounded">Delete</button>
            <button onClick={onClose} className="px-3 py-1 bg-gray-700 rounded">Close</button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-300">Here you can expand to a full-screen focused view for the task. Add notes, timer presets, or attachments in the future.</p>
        </div>
      </div>
    </div>
  )
}
