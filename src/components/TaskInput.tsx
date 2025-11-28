import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Sparkles } from 'lucide-react'

type Props = {
  onAdd: (text: string) => void
}

export default function TaskInput({ onAdd }: Props) {
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full animate-fade-in">
      <div className={`flex items-center gap-2 p-1 rounded-xl transition-all duration-300 ${
        isFocused ? 'bg-white/10 ring-2 ring-indigo-500/50' : 'bg-white/5'
      }`}>
        <div className="flex items-center gap-2 flex-1 px-3">
          <Sparkles size={18} className={`transition-colors ${isFocused ? 'text-indigo-400' : 'text-gray-500'}`} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What's your next focus?"
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 py-3 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Add task"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
        </button>
      </div>
    </form>
  )
}
