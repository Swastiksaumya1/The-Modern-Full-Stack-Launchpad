import { useState } from 'react'
import { Delete, RotateCcw } from 'lucide-react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [justCalculated, setJustCalculated] = useState(false)

  function handleNum(n: string) {
    if (justCalculated) {
      setDisplay(n)
      setJustCalculated(false)
    } else {
      setDisplay((d) => (d === '0' ? n : d + n))
    }
  }

  function handleOp(op: string) {
    if (prev === null) {
      setPrev(parseFloat(display))
      setDisplay('0')
      setOperation(op)
      setJustCalculated(false)
    }
  }

  function handleEquals() {
    if (prev !== null && operation) {
      const result = calc(prev, parseFloat(display), operation)
      const expr = `${prev} ${operation} ${display} = ${result}`
      setHistory((h) => [expr, ...h.slice(0, 9)])
      setDisplay(String(result))
      setPrev(null)
      setOperation(null)
      setJustCalculated(true)
    }
  }

  function calc(a: number, b: number, op: string): number {
    switch (op) {
      case '+': return a + b
      case '-': return a - b
      case '×': return a * b
      case '÷': return b !== 0 ? a / b : 0
      default: return b
    }
  }

  function clear() {
    setDisplay('0')
    setPrev(null)
    setOperation(null)
    setJustCalculated(false)
  }

  function backspace() {
    setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0')
  }

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '='],
  ]

  const getButtonStyle = (btn: string) => {
    if (btn === '=') return 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white'
    if (['÷', '×', '-', '+'].includes(btn)) return 'bg-gradient-to-br from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white'
    if (['C', '⌫', '%', '±'].includes(btn)) return 'bg-white/10 hover:bg-white/20 text-gray-200'
    return 'bg-white/5 hover:bg-white/15 text-white'
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Display */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 mb-4 animate-fade-in">
        <div className="text-right">
          {prev !== null && (
            <div className="text-gray-500 text-sm mb-1 animate-slide-down">
              {prev} {operation}
            </div>
          )}
          <div className="text-4xl font-light text-white tracking-wider overflow-x-auto">
            {display}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {buttons.flat().map((btn, i) => (
          <button
            key={btn}
            onClick={() => {
              if (btn === '=') handleEquals()
              else if (btn === 'C') clear()
              else if (btn === '⌫') backspace()
              else if (['÷', '×', '-', '+'].includes(btn)) handleOp(btn)
              else if (btn === '±') setDisplay(d => d.startsWith('-') ? d.slice(1) : '-' + d)
              else if (btn === '%') setDisplay(d => String(parseFloat(d) / 100))
              else handleNum(btn)
            }}
            className={`${getButtonStyle(btn)} rounded-xl text-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 animate-scale-in`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            {btn === '⌫' ? <Delete size={20} className="mx-auto" /> : btn}
          </button>
        ))}
      </div>

      {/* History */}
      <div className="mt-4 bg-white/5 rounded-xl p-3 max-h-28 overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">History</span>
          {history.length > 0 && (
            <button onClick={() => setHistory([])} className="text-xs text-gray-500 hover:text-white transition-colors">
              <RotateCcw size={12} />
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <div className="text-gray-600 text-xs">No calculations yet</div>
        ) : (
          <div className="space-y-1">
            {history.map((h, i) => (
              <div key={i} className="text-xs text-gray-400 font-mono">{h}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
