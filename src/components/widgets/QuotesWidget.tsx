import { useState } from 'react'
import { RefreshCw, Quote } from 'lucide-react'
import type { WidgetProps } from '../../types/widgets'

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "Your time is limited, don't waste it.", author: "Steve Jobs" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
]

interface QuotesWidgetProps extends WidgetProps {
  accentColor: string
}

export function QuotesWidget({ editMode, accentColor }: QuotesWidgetProps) {
  const [quoteIndex, setQuoteIndex] = useState(0)
  const quote = QUOTES[quoteIndex]

  const nextQuote = () => {
    setQuoteIndex((i) => (i + 1) % QUOTES.length)
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden transition-all duration-200 ${
      editMode ? 'ring-2 ring-sky-400/70 animate-wiggle cursor-move' : 'hover:shadow-2xl hover:-translate-y-1'
    }`}
    style={{ 
      background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
      border: `1px solid ${accentColor}40`
    }}
    >
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

      <div className="p-4 flex items-center gap-4">
        <Quote size={24} className="text-slate-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-200 italic leading-relaxed">"{quote.text}"</p>
          <p className="text-xs text-slate-500 mt-1">— {quote.author}</p>
        </div>
        <button
          onClick={nextQuote}
          className="p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition-all flex-shrink-0"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  )
}

