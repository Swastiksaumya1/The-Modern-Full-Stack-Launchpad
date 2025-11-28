import { useState } from 'react'
import { Plus, X, Maximize2 } from 'lucide-react'
import type { Note, WidgetProps } from '../../types/widgets'

interface NotesWidgetProps extends WidgetProps {
  notes: Note[]
  onNotesChange: (notes: Note[]) => void
}

const NOTE_COLORS = [
  { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-200' },
  { bg: 'bg-pink-500/20', border: 'border-pink-500/40', text: 'text-pink-200' },
  { bg: 'bg-sky-500/20', border: 'border-sky-500/40', text: 'text-sky-200' },
  { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-200' },
  { bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-200' },
]

export function NotesWidget({ editMode, onExpand, notes, onNotesChange }: NotesWidgetProps) {
  const [newNote, setNewNote] = useState('')

  const addNote = () => {
    if (newNote.trim()) {
      const colorIndex = notes.length % NOTE_COLORS.length
      onNotesChange([...notes, { 
        id: Date.now().toString(), 
        text: newNote.trim(), 
        color: colorIndex.toString() 
      }])
      setNewNote('')
    }
  }

  const deleteNote = (id: string) => {
    onNotesChange(notes.filter(n => n.id !== id))
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
        <h2 className="text-sm font-medium text-slate-200">Quick Notes</h2>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Add Note */}
      <div className="flex gap-2 mb-3">
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addNote()}
          className="flex-1 rounded-xl bg-slate-800/80 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          placeholder="Quick note..."
        />
        <button 
          onClick={addNote}
          className="p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-400 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto custom-scrollbar">
        {notes.length === 0 ? (
          <p className="col-span-2 text-center py-4 text-slate-500 text-xs">No notes yet</p>
        ) : (
          notes.slice(0, 6).map((note) => {
            const colorIndex = parseInt(note.color) || 0
            const colors = NOTE_COLORS[colorIndex % NOTE_COLORS.length]
            return (
              <div
                key={note.id}
                className={`relative p-3 rounded-xl ${colors.bg} border ${colors.border} group`}
              >
                <p className={`text-xs ${colors.text} line-clamp-3`}>{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-slate-900/50 text-slate-400 hover:text-white transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

