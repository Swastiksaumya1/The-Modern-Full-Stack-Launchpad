import React from 'react';

// Elevation levels for glassmorphism
export const elevationStyles = {
  // Level 0: Base surface
  base: 'bg-gray-950/80 backdrop-blur-sm border border-gray-800/30',

  // Level 1: Slightly raised
  elevated1: 'bg-gray-900/50 backdrop-blur-md border border-gray-700/30 shadow-lg',

  // Level 2: More elevated
  elevated2: 'bg-gray-900/60 backdrop-blur-lg border border-gray-600/30 shadow-2xl',

  // Level 3: Floating (dock)
  elevated3:
    'bg-gray-900/70 backdrop-blur-xl border border-gray-500/40 shadow-2xl shadow-blue-500/20',

  // Level 4: Top layer (modals)
  elevated4:
    'bg-gray-900/80 backdrop-blur-3xl border border-gray-400/50 shadow-2xl shadow-cyan-500/30',
};

export const hoverStates = {
  // Subtle scale on hover
  scaleSubtle: 'hover:scale-[1.01] transition-transform duration-200',
  scaleModerate: 'hover:scale-[1.02] transition-transform duration-200',
  scaleLarge: 'hover:scale-[1.05] transition-transform duration-200',

  // Brightness adjustment
  brightSubtle: 'hover:brightness-110 transition-all duration-200',
  brightModerate: 'hover:brightness-125 transition-all duration-200',

  // Shadow enhancement
  shadowEnhance:
    'hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200',
};

// Component wrapper with elevation
interface GlassmorphismProps {
  children: React.ReactNode;
  elevation?: 'base' | 'elevated1' | 'elevated2' | 'elevated3' | 'elevated4';
  className?: string;
  hover?: 'scaleSubtle' | 'scaleModerate' | 'scaleLarge' | 'brightSubtle' | 'brightModerate' | 'shadowEnhance';
  onClick?: () => void;
  interactive?: boolean;
}

export const Glassmorphic: React.FC<GlassmorphismProps> = ({
  children,
  elevation = 'base',
  className = '',
  hover,
  onClick,
  interactive = false,
}) => {
  const baseClass =
    'rounded-xl backdrop-blur-md transition-all duration-300 relative';
  const hoverClass = hover ? hoverStates[hover] : '';
  const interactiveClass = interactive
    ? 'cursor-pointer hover:brightness-110'
    : '';

  return (
    <div
      className={`${baseClass} ${elevationStyles[elevation]} ${hoverClass} ${interactiveClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Dock component for the bottom taskbar with glassmorphism
export const GlassmorphicDock: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2
        ${elevationStyles.elevated3}
        rounded-full px-6 py-3 flex gap-2
        backdrop-blur-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Widget card with elevation hierarchy
export const ElevatedWidget: React.FC<{
  children: React.ReactNode;
  elevation?: number; // 1-4
  className?: string;
}> = ({ children, elevation = 1, className = '' }) => {
  const elevationKey = `elevated${elevation}` as keyof typeof elevationStyles;

  return (
    <div
      className={`
        rounded-lg p-4 
        ${elevationStyles[elevationKey]}
        hover:shadow-lg transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Micro-interaction: Elevation on focus/active state
export const InteractiveGlassmorphic: React.FC<
  GlassmorphismProps & {
    onPress?: () => void;
  }
> = ({ children, elevation = 'base', onPress, ...props }) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <Glassmorphic
      elevation={isPressed ? 'elevated2' : elevation}
      className={props.className}
      onClick={() => {
        setIsPressed(!isPressed);
        onPress?.();
        props.onClick?.();
      }}
      interactive
    >
      {children}
    </Glassmorphic>
  );
};

export default Glassmorphic;
