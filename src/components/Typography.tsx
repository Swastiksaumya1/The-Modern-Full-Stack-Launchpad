import React from 'react';

// Typography hierarchy system
export const typographyClasses = {
  // Headings
  h1: 'text-4xl font-bold tracking-tight', // 36px
  h2: 'text-3xl font-semibold', // 30px
  h3: 'text-2xl font-semibold', // 24px - Main heading

  // Body text
  bodyLarge: 'text-lg font-medium', // Widget titles - 18px
  body: 'text-base font-normal', // Regular text - 16px
  bodySmall: 'text-sm font-normal', // Secondary - 14px
  bodySmallerSmall: 'text-xs font-normal', // Labels - 12px

  // Special sizes
  timerLarge: 'text-5xl font-bold tabular-nums', // 48px - Large timers
  timerMedium: 'text-3xl font-bold tabular-nums', // 36px - Medium timers
  timerSmall: 'text-2xl font-bold tabular-nums', // 24px - Small timers

  // Widget titles
  widgetTitle: 'text-lg font-medium', // 18px semibold
  widgetSubtitle: 'text-sm font-medium', // 14px medium
  widgetLabel: 'text-xs font-medium text-gray-400', // 12px subtle

  // Interactive
  button: 'text-sm font-semibold', // 14px
  buttonSmall: 'text-xs font-semibold', // 12px
  link: 'text-base font-medium underline', // 16px
};

// Text components with proper hierarchy
export const H1: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h1 className={`${typographyClasses.h1} text-white ${className}`}>
    {children}
  </h1>
);

export const H2: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h2 className={`${typographyClasses.h2} text-gray-100 ${className}`}>
    {children}
  </h2>
);

export const H3: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <h3 className={`${typographyClasses.h3} text-gray-100 ${className}`}>
    {children}
  </h3>
);

export const WidgetTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`${typographyClasses.widgetTitle} text-white ${className}`}>
    {children}
  </div>
);

export const WidgetSubtitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`${typographyClasses.widgetSubtitle} text-gray-300 ${className}`}>
    {children}
  </div>
);

export const WidgetLabel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`${typographyClasses.widgetLabel} uppercase tracking-wider ${className}`}>
    {children}
  </div>
);

export const TimerDisplay: React.FC<{
  children: React.ReactNode;
  size?: 'large' | 'medium' | 'small';
  className?: string;
}> = ({ children, size = 'medium', className = '' }) => {
  const sizeMap = {
    large: typographyClasses.timerLarge,
    medium: typographyClasses.timerMedium,
    small: typographyClasses.timerSmall,
  };

  return (
    <div className={`${sizeMap[size]} text-blue-400 font-mono ${className}`}>
      {children}
    </div>
  );
};

export const BodyText: React.FC<{
  children: React.ReactNode;
  size?: 'large' | 'normal' | 'small' | 'xs';
  className?: string;
  secondary?: boolean;
}> = ({ children, size = 'normal', className = '', secondary = false }) => {
  const sizeMap = {
    large: typographyClasses.bodyLarge,
    normal: typographyClasses.body,
    small: typographyClasses.bodySmall,
    xs: typographyClasses.bodySmallerSmall,
  };

  return (
    <p
      className={`${sizeMap[size]} ${
        secondary ? 'text-gray-400' : 'text-gray-200'
      } ${className}`}
    >
      {children}
    </p>
  );
};

export const ButtonText: React.FC<{
  children: React.ReactNode;
  size?: 'normal' | 'small';
  className?: string;
}> = ({ children, size = 'normal', className = '' }) => {
  const sizeMap = {
    normal: typographyClasses.button,
    small: typographyClasses.buttonSmall,
  };

  return (
    <span className={`${sizeMap[size]} text-white uppercase ${className}`}>
      {children}
    </span>
  );
};

export default {
  H1,
  H2,
  H3,
  WidgetTitle,
  WidgetSubtitle,
  WidgetLabel,
  TimerDisplay,
  BodyText,
  ButtonText,
};
