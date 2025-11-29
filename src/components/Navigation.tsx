import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  subItems?: NavigationItem[];
}

interface EnhancedNavigationProps {
  items: NavigationItem[];
  onNavigate?: (itemId: string) => void;
  editMode?: boolean;
  onEditToggle?: () => void;
}

export const StickyTopBar: React.FC<{
  children?: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
  className?: string;
}> = ({ children, title, actions, className = '' }) => {
  return (
    <div
      className={`
        sticky top-0 z-40
        bg-gray-900/80 backdrop-blur-lg
        border-b border-gray-800/50
        px-4 py-3 flex items-center justify-between
        ${className}
      `}
    >
      <div className="flex items-center gap-4">
        {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
        {children}
      </div>
      {actions}
    </div>
  );
};

// Expandable drawer navigation pattern
export const ExpandableDrawer: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}> = ({ isOpen, onToggle, children, position = 'left', className = '' }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={onToggle}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 ${position}-0 h-screen
          bg-gray-900/95 backdrop-blur-xl
          border-${position === 'left' ? 'r' : 'l'} border-gray-800
          transform transition-transform duration-300 z-50
          w-64 max-w-xs
          ${isOpen ? 'translate-x-0' : (position === 'left' ? '-translate-x-full' : 'translate-x-full')}
          ${className}
        `}
      >
        <div className="p-4 overflow-y-auto h-full">
          {children}
        </div>
      </div>
    </>
  );
};

// Smooth vertical scroll container with custom scrollbar
export const SmoothScrollContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        overflow-y-auto overflow-x-hidden
        scrollbar scrollbar-thumb-gray-700 scrollbar-track-gray-900
        ${className}
      `}
      style={{
        scrollBehavior: 'smooth',
      }}
    >
      {children}
    </div>
  );
};

// Navigation menu with dropdown support
export const NavigationMenu: React.FC<EnhancedNavigationProps> = ({
  items,
  onNavigate,
  editMode = false,
  onEditToggle,
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(itemId)) {
      newOpen.delete(itemId);
    } else {
      newOpen.add(itemId);
    }
    setOpenItems(newOpen);
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.subItems && item.subItems.length > 0) {
      toggleItem(item.id);
    } else {
      item.onClick?.();
      onNavigate?.(item.id);
    }
  };

  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <div key={item.id}>
          {/* Main item */}
          <button
            onClick={() => handleItemClick(item)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-lg
              transition-all duration-200
              ${item.subItems?.length
                ? 'hover:bg-gray-800'
                : 'hover:bg-blue-600/20 hover:text-blue-400'
              }
              text-gray-300 hover:text-white
              group
            `}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span className="font-medium">{item.label}</span>
            </div>

            {item.subItems && item.subItems.length > 0 && (
              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  openItems.has(item.id) ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {/* Submenu items */}
          {item.subItems && openItems.has(item.id) && (
            <div className="pl-8 space-y-2 mt-2 border-l border-gray-800 ml-4">
              {item.subItems.map((subItem) => (
                <button
                  key={subItem.id}
                  onClick={() => {
                    subItem.onClick?.();
                    onNavigate?.(subItem.id);
                  }}
                  className="
                    w-full text-left px-4 py-2 rounded-lg
                    text-gray-400 hover:text-gray-100
                    hover:bg-gray-800/50
                    transition-colors duration-150
                    text-sm
                  "
                >
                  {subItem.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Edit mode toggle */}
      {onEditToggle && (
        <button
          onClick={onEditToggle}
          className={`
            w-full mt-6 px-4 py-3 rounded-lg font-semibold
            transition-all duration-200
            ${editMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }
          `}
        >
          {editMode ? '✓ Exit Edit Mode' : '✏️ Edit Widgets'}
        </button>
      )}
    </nav>
  );
};

// Tabs-style navigation
export const TabNavigation: React.FC<{
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div
      className={`
        flex gap-1 border-b border-gray-800
        px-4 overflow-x-auto scrollbar-hide
        ${className}
      `}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            px-4 py-3 whitespace-nowrap
            flex items-center gap-2
            border-b-2 transition-all duration-200
            font-medium text-sm
            ${activeTab === tab.id
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default {
  StickyTopBar,
  ExpandableDrawer,
  SmoothScrollContainer,
  NavigationMenu,
  TabNavigation,
};
