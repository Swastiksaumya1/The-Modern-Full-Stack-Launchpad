import React, { createContext, useState, useContext } from 'react';

export type ThemeType = 'dark' | 'amoled' | 'pastel' | 'minimal';
export type LayoutType = 'compact' | 'balanced' | 'spacious';

interface ThemeContextType {
  theme: ThemeType;
  layout: LayoutType;
  widgetStyle: 'modern' | 'classic' | 'minimal';
  setTheme: (theme: ThemeType) => void;
  setLayout: (layout: LayoutType) => void;
  setWidgetStyle: (style: 'modern' | 'classic' | 'minimal') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Theme color schemes
const themes = {
  dark: {
    bg: 'bg-gray-950',
    surface: 'bg-gray-900',
    border: 'border-gray-800',
    text: 'text-gray-100',
    accent: 'text-blue-400',
  },
  amoled: {
    bg: 'bg-black',
    surface: 'bg-gray-950',
    border: 'border-gray-900',
    text: 'text-white',
    accent: 'text-cyan-400',
  },
  pastel: {
    bg: 'bg-blue-50',
    surface: 'bg-white',
    border: 'border-blue-200',
    text: 'text-gray-800',
    accent: 'text-pink-500',
  },
  minimal: {
    bg: 'bg-white',
    surface: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-black',
    accent: 'text-gray-600',
  },
};

// Layout spacing configurations
const layouts = {
  compact: {
    gap: 'gap-2',
    padding: 'p-2',
    widgetPadding: 'p-2',
    fontSize: 'text-sm',
  },
  balanced: {
    gap: 'gap-4',
    padding: 'p-4',
    widgetPadding: 'p-4',
    fontSize: 'text-base',
  },
  spacious: {
    gap: 'gap-6',
    padding: 'p-6',
    widgetPadding: 'p-6',
    fontSize: 'text-lg',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [layout, setLayout] = useState<LayoutType>('balanced');
  const [widgetStyle, setWidgetStyle] = useState<'modern' | 'classic' | 'minimal'>('modern');

  return (
    <ThemeContext.Provider
      value={{
        theme,
        layout,
        widgetStyle,
        setTheme,
        setLayout,
        setWidgetStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Theme selector component
export const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions: Array<{ id: ThemeType; label: string; icon: string }> = [
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'amoled', label: 'AMOLED', icon: '🫐' },
    { id: 'pastel', label: 'Pastel', icon: '🎨' },
    { id: 'minimal', label: 'Minimal', icon: '⚪' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Theme</h3>
      <div className="grid grid-cols-2 gap-2">
        {themeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`
              p-3 rounded-lg transition-all duration-200
              font-medium text-sm flex items-center gap-2
              ${theme === option.id
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            <span>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Layout selector component
export const LayoutSelector: React.FC = () => {
  const { layout, setLayout } = useTheme();

  const layoutOptions: Array<{ id: LayoutType; label: string; icon: string }> = [
    { id: 'compact', label: 'Compact', icon: '🗂️' },
    { id: 'balanced', label: 'Balanced', icon: '⚖️' },
    { id: 'spacious', label: 'Spacious', icon: '📂' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Layout</h3>
      <div className="grid grid-cols-3 gap-2">
        {layoutOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setLayout(option.id)}
            className={`
              p-3 rounded-lg transition-all duration-200
              font-medium text-sm flex flex-col items-center gap-1
              ${layout === option.id
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            <span className="text-lg">{option.icon}</span>
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Widget style selector
export const WidgetStyleSelector: React.FC = () => {
  const { widgetStyle, setWidgetStyle } = useTheme();

  const styleOptions: Array<{ id: 'modern' | 'classic' | 'minimal'; label: string; icon: string }> = [
    { id: 'modern', label: 'Modern', icon: '✨' },
    { id: 'classic', label: 'Classic', icon: '🎯' },
    { id: 'minimal', label: 'Minimal', icon: '▬' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Widget Style</h3>
      <div className="grid grid-cols-3 gap-2">
        {styleOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setWidgetStyle(option.id)}
            className={`
              p-3 rounded-lg transition-all duration-200
              font-medium text-sm flex flex-col items-center gap-1
              ${widgetStyle === option.id
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }
            `}
          >
            <span className="text-lg">{option.icon}</span>
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Personalization panel
export const PersonalizationPanel: React.FC<{
  onClose?: () => void;
  className?: string;
}> = ({ onClose, className = '' }) => {
  return (
    <div
      className={`
        bg-gray-900 border border-gray-800 rounded-lg
        p-6 space-y-8 max-w-sm
        ${className}
      `}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Personalization</h2>
        <p className="text-sm text-gray-400">Customize your Focus Dashboard experience</p>
      </div>

      {/* Theme Selector */}
      <ThemeSelector />

      {/* Layout Selector */}
      <LayoutSelector />

      {/* Widget Style Selector */}
      <WidgetStyleSelector />

      {/* Advanced Options */}
      <div className="space-y-3 border-t border-gray-800 pt-6">
        <h3 className="text-sm font-semibold text-gray-300">Advanced</h3>
        <label className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm text-gray-300">Reduce motion</span>
        </label>
        <label className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer">
          <input type="checkbox" className="w-4 h-4" />
          <span className="text-sm text-gray-300">High contrast</span>
        </label>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
        >
          Done
        </button>
      )}
    </div>
  );
};

export default {
  ThemeProvider,
  useTheme,
  ThemeSelector,
  LayoutSelector,
  WidgetStyleSelector,
  PersonalizationPanel,
};
