import React, { useState } from 'react';

// Ripple effect hook
export const useRipple = () => {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  let rippleId = 0;

  const addRipple = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = rippleId++;
    setRipples((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return { ripples, addRipple };
};

// Ring animation for timers (like Apple Watch)
export const TimerRingAnimation: React.FC<{
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  className?: string;
}> = ({ progress, size = 100, strokeWidth = 4, className = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      className={`transform -rotate-90 ${className}`}
      style={{
        filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))',
      }}
    >
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-800 opacity-30"
      />

      {/* Progress ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-blue-400 transition-all duration-300"
        style={{
          filter: progress > 0.8 ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : '',
        }}
      />
    </svg>
  );
};

// Tap feedback sound
export const useSoundEffect = () => {
  const playSound = (type: 'tap' | 'success' | 'error' | 'warning') => {
    // Create a simple sine wave sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    // Sound frequency based on type
    const frequencies = {
      tap: 400,
      success: 800,
      error: 200,
      warning: 600,
    };

    oscillator.frequency.value = frequencies[type];
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return { playSound };
};

// Smooth fade-in animation
export const FadeInView: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  return (
    <div
      className={`animate-fadeIn ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
};

// Click animation button
export const InteractiveButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const { ripples, addRipple } = useRipple();
  const { playSound } = useSoundEffect();

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-100',
    ghost: 'hover:bg-gray-800/30 text-gray-300',
  };

  return (
    <button
      onClick={(e) => {
        addRipple(e);
        playSound('tap');
        onClick?.();
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`
        relative overflow-hidden
        px-4 py-2 rounded-lg font-medium
        transition-all duration-150
        active:scale-95
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '20px',
            height: '20px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            animation: 'rippleExpand 0.6s ease-out',
          }}
        />
      ))}

      {children}
    </button>
  );
};

// Hover feedback for cards
export const HoverCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        rounded-lg p-4
        bg-gray-900 border border-gray-800
        transition-all duration-200
        hover:scale-102 hover:shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// Smooth scroll animation
export const ScrollToTop: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  React.useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-8 right-8 z-40
            p-3 bg-blue-600 hover:bg-blue-700
            rounded-full shadow-lg
            text-white transition-all duration-200
            active:scale-90
            ${className}
          `}
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
};

// Animated counter
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  className?: string;
}> = ({ value, duration = 1000, className = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};

// CSS animations for global use
export const microInteractionStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes rippleExpand {
    to {
      width: 100px;
      height: 100px;
      opacity: 0;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.3s ease-out;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .animate-bounce {
    animation: bounce 1s infinite;
  }
`;

export default {
  useRipple,
  useSoundEffect,
  TimerRingAnimation,
  FadeInView,
  InteractiveButton,
  HoverCard,
  ScrollToTop,
  AnimatedCounter,
};
