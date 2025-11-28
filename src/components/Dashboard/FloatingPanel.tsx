import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { X, Maximize2, Minimize2 } from 'lucide-react'

type Props = {
  title: string
  icon: ReactNode
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
}

export default function FloatingPanel({ 
  title, 
  icon, 
  children, 
  isOpen, 
  onClose,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 500 }
}: Props) {
  const [position, setPosition] = useState(defaultPosition)
  const [size] = useState(defaultSize)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      })
    }

    const handleMouseUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    setIsDragging(true)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 200)
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed z-40 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden ${
        isClosing ? 'animate-scale-out' : 'animate-window-open'
      }`}
      style={isMaximized ? {
        top: 48, left: 0, right: 0, bottom: 80, width: 'auto', height: 'auto'
      } : {
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-white/10 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={toggleMaximize}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={handleClose}
            className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  )
}

