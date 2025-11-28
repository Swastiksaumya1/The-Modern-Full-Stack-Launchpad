import { useState, useEffect, useRef } from 'react'
import { X, Minus, Square, Maximize2 } from 'lucide-react'

export type WindowType = 'tasks' | 'notes' | 'calculator' | 'calendar' | 'analytics' | 'music' | 'pomodoro' | 'clock' | 'stopwatch' | 'timer' | 'weather' | 'settings' | 'filemanager'

type WindowState = {
  type: WindowType
  id: string
  title: string
  isMinimized: boolean
  isMaximized: boolean
  zIndex?: number
}

type Props = {
  window: WindowState
  children: React.ReactNode
  onClose: (id: string) => void
  onMinimize: (id: string) => void
  onMaximize: (id: string) => void
  onFocus: (id: string) => void
  zIndex: number
}

export default function Window({ window: win, children, onClose, onMinimize, onMaximize, onFocus, zIndex }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [pos, setPos] = useState({ x: 50 + Math.random() * 150, y: 30 + Math.random() * 100 })
  const [size, setSize] = useState({ width: 420, height: 520 })
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(true)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 350)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPos({ x: e.clientX - offset.x, y: Math.max(0, e.clientY - offset.y) })
      }
      if (isResizing) {
        const newWidth = Math.max(300, e.clientX - pos.x)
        const newHeight = Math.max(200, e.clientY - pos.y)
        setSize({ width: newWidth, height: newHeight })
      }
    }
    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, offset, pos])

  function handleMouseDown(e: React.MouseEvent) {
    onFocus(win.id)
    setIsDragging(true)
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y })
  }

  function handleClose() {
    setIsClosing(true)
    setTimeout(() => onClose(win.id), 250)
  }

  function handleResizeStart(e: React.MouseEvent) {
    e.stopPropagation()
    onFocus(win.id)
    setIsResizing(true)
  }

  if (win.isMinimized) return null

  const animationClass = isClosing ? 'animate-window-close' : isOpening ? 'animate-window-open' : ''

  return (
    <div
      ref={windowRef}
      onClick={() => onFocus(win.id)}
      className={`fixed rounded-xl overflow-hidden flex flex-col glass shadow-2xl ${animationClass} ${
        win.isMaximized ? 'inset-2 !m-0' : ''
      }`}
      style={{
        left: win.isMaximized ? undefined : pos.x,
        top: win.isMaximized ? undefined : pos.y,
        width: win.isMaximized ? undefined : size.width,
        height: win.isMaximized ? undefined : size.height,
        zIndex: zIndex,
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 text-white px-4 py-2.5 flex justify-between items-center cursor-move select-none backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{win.title.split(' ')[0]}</span>
          <h3 className="font-semibold text-sm">{win.title.split(' ').slice(1).join(' ')}</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(win.id) }}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-yellow-500/80 bg-yellow-500/50 transition-all duration-200 hover:scale-110"
            title="Minimize"
          >
            <Minus size={12} strokeWidth={3} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(win.id) }}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-green-500/80 bg-green-500/50 transition-all duration-200 hover:scale-110"
            title="Maximize"
          >
            {win.isMaximized ? <Square size={10} strokeWidth={3} /> : <Maximize2 size={12} strokeWidth={2} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleClose() }}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-500/80 bg-red-500/50 transition-all duration-200 hover:scale-110"
            title="Close"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-gray-900/95">{children}</div>

      {/* Resize Handle */}
      {!win.isMaximized && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.3) 50%)',
          }}
        />
      )}
    </div>
  )
}
