import { useState, useEffect } from 'react'
import { Trash2, Plus, Pin } from 'lucide-react'

type Note = {
  id: string
  title: string
  content: string
  color: string
  createdAt: string
  pinned?: boolean
}

const colorOptions = [
  { bg: 'from-yellow-400 to-amber-500', text: 'text-yellow-900' },
  { bg: 'from-pink-400 to-rose-500', text: 'text-pink-900' },
  { bg: 'from-blue-400 to-cyan-500', text: 'text-blue-900' },
  { bg: 'from-green-400 to-emerald-500', text: 'text-green-900' },
  { bg: 'from-purple-400 to-violet-500', text: 'text-purple-900' },
  { bg: 'from-orange-400 to-red-500', text: 'text-orange-900' },
]

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem('focus-notes')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('focus-notes', JSON.stringify(notes))
  }, [notes])

  function addNote() {
    const colorIdx = Math.floor(Math.random() * colorOptions.length)
    const newNote: Note = {
      id: String(Date.now()),
      title: 'New Note',
      content: '',
      color: colorIdx.toString(),
      createdAt: new Date().toLocaleString(),
      pinned: false,
    }
    setNotes((n) => [newNote, ...n])
    setEditingId(newNote.id)
  }

  function deleteNote(id: string) {
    setNotes((n) => n.filter((x) => x.id !== id))
  }

  function updateNote(id: string, updates: Partial<Note>) {
    setNotes((n) => n.map((x) => (x.id === id ? { ...x, ...updates } : x)))
  }

  function togglePin(id: string) {
    setNotes((n) => n.map((x) => (x.id === id ? { ...x, pinned: !x.pinned } : x)))
  }

  const sortedNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))

  return (
    <div className="p-4 h-full overflow-y-auto">
      <button
        onClick={addNote}
        className="w-full mb-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg animate-fade-in"
      >
        <Plus size={18} /> Create New Note
      </button>

      {notes.length === 0 ? (
        <div className="text-center text-gray-500 py-12 animate-fade-in">
          <div className="text-5xl mb-3">📝</div>
          <p>No notes yet</p>
          <p className="text-sm">Click the button above to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {sortedNotes.map((note, index) => {
            const colorIdx = parseInt(note.color) || 0
            const colors = colorOptions[colorIdx % colorOptions.length]

            return (
              <div
                key={note.id}
                className={`bg-gradient-to-br ${colors.bg} p-4 rounded-xl shadow-lg cursor-pointer relative group transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {note.pinned && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Pin size={12} className="text-gray-700" />
                  </div>
                )}

                {editingId === note.id ? (
                  <div onClick={(e) => e.stopPropagation()} className="space-y-2">
                    <input
                      autoFocus
                      value={note.title}
                      onChange={(e) => updateNote(note.id, { title: e.target.value })}
                      className={`w-full font-bold text-sm bg-white/30 rounded px-2 py-1 ${colors.text} placeholder-current/50`}
                      placeholder="Note title..."
                    />
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, { content: e.target.value })}
                      className={`w-full text-xs bg-white/30 rounded p-2 resize-none ${colors.text} placeholder-current/50`}
                      rows={4}
                      placeholder="Write your note..."
                    />
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs bg-black/20 hover:bg-black/30 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div onClick={() => setEditingId(note.id)}>
                    <div className={`font-bold text-sm ${colors.text}`}>{note.title}</div>
                    <div className={`text-xs mt-2 line-clamp-3 ${colors.text} opacity-80`}>
                      {note.content || 'Click to add content...'}
                    </div>
                    <div className={`text-[10px] mt-3 ${colors.text} opacity-60`}>{note.createdAt}</div>

                    {/* Action buttons */}
                    <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePin(note.id) }}
                        className="p-1.5 bg-white/30 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <Pin size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                        className="p-1.5 bg-red-500/50 hover:bg-red-500/70 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
