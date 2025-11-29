import React, { useState, useRef, useEffect } from 'react';

// Grid configuration constants
const GRID_COLS = 12;
const GRID_ROW_HEIGHT = 80; // pixels
const GRID_GAP = 16; // 16px spacing
const SNAP_THRESHOLD = 8; // pixels for snap-to-grid

export interface GridItem {
  id: string;
  x: number; // column (0-11)
  y: number; // row
  width: number; // columns (1-12)
  height: number; // rows
  component: React.ReactNode;
  minWidth?: number; // minimum columns
  minHeight?: number; // minimum rows
}

interface GridLayoutProps {
  items: GridItem[];
  onLayoutChange?: (items: GridItem[]) => void;
  editMode?: boolean;
  containerWidth?: number;
}

export const GridLayout: React.FC<GridLayoutProps> = ({
  items,
  onLayoutChange,
  editMode = false,
  containerWidth = 1200,
}) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingItem, setResizingItem] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colWidth = (containerWidth - GRID_GAP * (GRID_COLS - 1)) / GRID_COLS;

  // Snap to grid helper
  const snapToGrid = (value: number, gridSize: number): number => {
    return Math.round(value / gridSize) * gridSize;
  };

  // Get grid position from pixel position
  const getGridPosition = (
    pixelX: number,
    pixelY: number
  ): { col: number; row: number } => {
    const col = Math.round(pixelX / (colWidth + GRID_GAP));
    const row = Math.round(pixelY / (GRID_ROW_HEIGHT + GRID_GAP));
    return {
      col: Math.max(0, Math.min(GRID_COLS - 1, col)),
      row: Math.max(0, row),
    };
  };

  const handleMouseDown = (
    e: React.MouseEvent,
    itemId: string,
    isResize = false
  ) => {
    e.preventDefault();
    if (!editMode) return;

    if (isResize) {
      setResizingItem(itemId);
    } else {
      setDraggingItem(itemId);
      const item = items.find((i) => i.id === itemId);
      if (item && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left - item.x * (colWidth + GRID_GAP),
          y: e.clientY - rect.top - item.y * (GRID_ROW_HEIGHT + GRID_GAP),
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || (!draggingItem && !resizingItem)) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === draggingItem) {
          // Dragging logic
          const newX = mouseX - dragOffset.x;
          const newY = mouseY - dragOffset.y;

          const { col, row } = getGridPosition(newX, newY);

          // Validate new position doesn't overflow
          if (col + item.width <= GRID_COLS) {
            return { ...item, x: col, y: row };
          }
        }

        if (item.id === resizingItem) {
          // Resizing logic
          const newWidth = Math.ceil(mouseX / (colWidth + GRID_GAP));
          const newHeight = Math.ceil(mouseY / (GRID_ROW_HEIGHT + GRID_GAP));

          const minWidth = item.minWidth || 1;
          const minHeight = item.minHeight || 1;

          return {
            ...item,
            width: Math.max(minWidth, Math.min(GRID_COLS - item.x, newWidth)),
            height: Math.max(minHeight, newHeight),
          };
        }

        return item;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingItem(null);
    setResizingItem(null);
    // Snap final position to grid
    if (onLayoutChange) {
      onLayoutChange(items);
    }
  };

  const [localItems, setItems] = useState(items);

  useEffect(() => {
    setItems(items);
  }, [items]);

  useEffect(() => {
    if (draggingItem || resizingItem) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove as any);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingItem, resizingItem, dragOffset]);

  const getGridItemStyle = (item: GridItem) => ({
    gridColumn: `${item.x + 1} / span ${item.width}`,
    gridRow: `${item.y + 1} / span ${item.height}`,
    position: 'relative' as const,
  });

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto bg-gray-950 p-4"
      onMouseMove={handleMouseMove as any}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="grid gap-4 auto-rows-max"
        style={{
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gap: `${GRID_GAP}px`,
        }}
      >
        {localItems.map((item) => (
          <div
            key={item.id}
            className={`relative rounded-lg border-2 transition-all ${
              editMode
                ? 'border-blue-500 cursor-move hover:shadow-lg'
                : 'border-gray-800'
            } ${
              draggingItem === item.id
                ? 'opacity-75 shadow-2xl z-50'
                : 'opacity-100'
            }`}
            style={getGridItemStyle(item)}
            onMouseDown={(e) => handleMouseDown(e, item.id, false)}
          >
            {/* Item content */}
            <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
              {item.component}
            </div>

            {/* Edit mode controls */}
            {editMode && (
              <>
                {/* Drag handle */}
                <div className="absolute top-2 left-2 w-8 h-8 bg-blue-500 rounded cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity" />

                {/* Resize handle */}
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-tl cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => handleMouseDown(e, item.id, true)}
                />

                {/* Info badge */}
                <div className="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                  {item.x + 1},{item.y + 1} • {item.width}×{item.height}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridLayout;
