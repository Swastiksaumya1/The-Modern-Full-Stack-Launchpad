import React, { useState, useRef } from 'react';
import { Trash2, Copy, Settings } from 'lucide-react';

export interface EditModeConfig {
  isEditMode: boolean;
  selectedWidgetId: string | null;
  wiggleEnabled: boolean;
}

interface WidgetEditModeProps {
  widgetId: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  editConfig: EditModeConfig;
  children: React.ReactNode;
  className?: string;
}

export const WidgetEditMode: React.FC<WidgetEditModeProps> = ({
  widgetId,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  editConfig,
  children,
  className = '',
}) => {
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );
  const elementRef = useRef<HTMLDivElement>(null);

  // Handle long press for edit mode activation
  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      if (!editConfig.isEditMode) {
        // Start edit mode with wiggle
      }
      onSelect(widgetId);
    }, 500); // 500ms long press

    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Wiggle animation when in edit mode
  const wiggleClass = editConfig.isEditMode && editConfig.wiggleEnabled
    ? 'animate-wiggle'
    : '';

  // Resize mode (S/M/L sizes)
  const resizeOptions = [
    { label: 'S', cols: 3, rows: 2 },
    { label: 'M', cols: 6, rows: 3 },
    { label: 'L', cols: 12, rows: 4 },
  ];

  return (
    <div
      ref={elementRef}
      className={`relative ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Main widget content */}
      <div
        className={`
          rounded-lg border-2 transition-all
          ${editConfig.isEditMode
            ? 'border-blue-500 shadow-lg shadow-blue-500/30'
            : 'border-gray-800'
          }
          ${isSelected && editConfig.isEditMode
            ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-950'
            : ''
          }
          ${wiggleClass}
        `}
      >
        {children}
      </div>

      {/* Edit mode controls */}
      {editConfig.isEditMode && isSelected && (
        <div className="absolute -top-12 left-0 right-0 flex gap-2 justify-center mb-2">
          {/* Size controls (S/M/L) */}
          <div className="flex gap-1 bg-gray-900/90 backdrop-blur px-3 py-2 rounded-lg border border-gray-700">
            {resizeOptions.map((option) => (
              <button
                key={option.label}
                className="px-3 py-1 text-xs font-semibold bg-gray-800 hover:bg-blue-600 rounded transition-colors"
                title={`Resize to ${option.cols}x${option.rows}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom action buttons when selected */}
      {editConfig.isEditMode && isSelected && (
        <div className="absolute -bottom-14 left-0 right-0 flex gap-2 justify-center">
          {/* Duplicate button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(widgetId);
            }}
            className="p-2 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg hover:bg-blue-600 hover:border-blue-500 transition-colors"
            title="Duplicate widget"
          >
            <Copy size={16} className="text-blue-400" />
          </button>

          {/* Settings button */}
          <button
            className="p-2 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg hover:bg-blue-600 hover:border-blue-500 transition-colors"
            title="Widget settings"
          >
            <Settings size={16} className="text-blue-400" />
          </button>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Remove this widget?')) {
                onRemove(widgetId);
              }
            }}
            className="p-2 bg-gray-900/90 backdrop-blur border border-gray-700 rounded-lg hover:bg-red-600 hover:border-red-500 transition-colors"
            title="Remove widget"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      )}

      {/* Drag handle indicator when in edit mode */}
      {editConfig.isEditMode && (
        <div className="absolute top-2 left-2 flex gap-1">
          <div className="w-1 h-4 bg-blue-500 rounded-full opacity-60" />
          <div className="w-1 h-4 bg-blue-500 rounded-full opacity-60" />
          <div className="w-1 h-4 bg-blue-500 rounded-full opacity-60" />
        </div>
      )}
    </div>
  );
};

// Wiggle animation CSS (add to global styles or Tailwind config)
export const wiggleKeyframes = `
  @keyframes wiggle {
    0%, 100% { transform: rotate(-1deg) translateX(0); }
    25% { transform: rotate(1deg) translateX(2px); }
    50% { transform: rotate(-1deg) translateX(-2px); }
    75% { transform: rotate(1deg) translateX(2px); }
  }
  
  .animate-wiggle {
    animation: wiggle 0.5s ease-in-out infinite;
  }
`;

// iOS-style ripple effect for taps
export const RippleEffect: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, children, className = '' }) => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const elementRef = useRef<HTMLDivElement>(null);
  const rippleCountRef = useRef(0);

  const handleClick = (e: React.MouseEvent) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = rippleCountRef.current++;
    setRipples((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none animate-ripple"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '8px',
            height: '8px',
            background: 'rgba(59, 130, 246, 0.5)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'rippleExpand 0.6s ease-out',
          }}
        />
      ))}
    </div>
  );
};

// Ripple animation CSS
export const rippleKeyframes = `
  @keyframes rippleExpand {
    to {
      width: 200px;
      height: 200px;
      opacity: 0;
      transform: translate(-50%, -50%);
    }
  }
`;

export default WidgetEditMode;
