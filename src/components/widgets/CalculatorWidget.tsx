import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import type { WidgetProps } from '../../types/widgets'

interface CalculatorWidgetProps extends WidgetProps {
  accentColor: string
}

export function CalculatorWidget({ editMode, onExpand, accentColor }: CalculatorWidgetProps) {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ')
    setDisplay('0')
  }

  const handleEquals = () => {
    try {
      const result = eval(equation + display)
      setDisplay(String(result))
      setEquation('')
    } catch {
      setDisplay('Error')
      setEquation('')
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setEquation('')
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ]

  const getButtonStyle = (btn: string) => {
    if (btn === '=') return { background: accentColor, color: 'white' }
    if (['÷', '×', '-', '+', '%'].includes(btn)) return { background: 'rgba(255,255,255,0.1)' }
    if (['C', '⌫'].includes(btn)) return { background: 'rgba(239,68,68,0.2)', color: '#fca5a5' }
    return {}
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
        <h2 className="text-sm font-medium text-slate-200">Calculator</h2>
        {onExpand && (
          <button onClick={onExpand} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <Maximize2 size={14} />
          </button>
        )}
      </div>

      {/* Display */}
      <div className="bg-slate-800/80 rounded-xl p-3 mb-3">
        <p className="text-xs text-slate-500 h-4 text-right">{equation}</p>
        <p className="text-2xl font-semibold text-slate-100 text-right truncate">{display}</p>
      </div>

      {/* Buttons */}
      <div className="grid gap-2">
        {buttons.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === 'C') handleClear()
                  else if (btn === '⌫') handleBackspace()
                  else if (btn === '=') handleEquals()
                  else if (['÷', '×', '-', '+', '%'].includes(btn)) {
                    const op = btn === '÷' ? '/' : btn === '×' ? '*' : btn
                    handleOperator(op)
                  }
                  else handleNumber(btn)
                }}
                className={`py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:opacity-80 transition-all ${
                  btn === '0' ? 'col-span-2' : ''
                }`}
                style={{ 
                  background: 'rgba(255,255,255,0.05)',
                  ...getButtonStyle(btn)
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

