import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Pin } from 'lucide-react'

type Note = {
  id: string
  content: string
  color: string
  pinned: boolean
  createdAt: number
}

const colors = [
  'from-yellow-500/20 to-orange-500/20 border-yellow-500/30',
  'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'from-green-500/20 to-emerald-500/20 border-green-500/30',
  'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
]

export default function NotesWidget() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem('focus-dashboard-notes')
      return raw ? JSON.parse(raw) : [
        { id: '1', content: 'Welcome to Quick Notes! ✨', color: colors[0], pinned: true, createdAt: Date.now() },
        { id: '2', content: 'Click + to add a new note', color: colors[2], pinned: false, createdAt: Date.now() },
      ]
    } catch {
      return []
    }
  })
  const [, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('focus-dashboard-notes', JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      color: colors[Math.floor(Math.random() * colors.length)],
      pinned: false,
      createdAt: Date.now(),
    }
    setNotes(prev => [newNote, ...prev])
    setEditingId(newNote.id)
  }

  const updateNote = (id: string, content: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, content } : n))
  }

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.createdAt - a.createdAt
  })

  return (
    <div className="h-full flex flex-col bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-gray-400">
          <FileText size={16} />
          <span className="text-sm font-medium">Quick Notes</span>
        </div>
        <button
          onClick={addNote}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {sortedNotes.map((note, index) => (
          <div
            key={note.id}
            className={`group relative p-3 rounded-xl bg-gradient-to-br ${note.color} border backdrop-blur-sm animate-scale-in`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {note.pinned && (
              <Pin size={12} className="absolute top-2 right-2 text-yellow-500" fill="currentColor" />
            )}
            
            <textarea
              value={note.content}
              onChange={e => updateNote(note.id, e.target.value)}
              onFocus={() => setEditingId(note.id)}
              onBlur={() => setEditingId(null)}
              placeholder="Write something..."
              className="w-full bg-transparent resize-none outline-none text-sm min-h-[60px]"
              rows={3}
            />

            <div className="flex items-center justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => togglePin(note.id)}
                className={`p-1 rounded transition-colors ${note.pinned ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
              >
                <Pin size={12} />
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

