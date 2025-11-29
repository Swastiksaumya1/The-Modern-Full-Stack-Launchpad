import { useState } from 'react';
import { Lock } from 'lucide-react';

// Lock Screen Component
export const LockScreen: React.FC<{
  isLocked: boolean;
  onUnlock: () => void;
  wallpaper?: string;
}> = ({ isLocked, onUnlock, wallpaper }) => {

  if (!isLocked) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950"
      style={{
        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined,
        backgroundSize: 'cover',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Lock icon */}
      <Lock size={64} className="text-white mb-8 relative z-10" />

      {/* Time display */}
      <div className="text-6xl font-bold text-white mb-4 relative z-10">
        {new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* Date display */}
      <div className="text-2xl text-gray-300 mb-12 relative z-10">
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </div>

      {/* Unlock prompt */}
      <div className="relative z-10 text-center space-y-4">
        <p className="text-gray-300">Swipe up to unlock</p>
        <button
          onClick={onUnlock}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold transition-colors"
        >
          Unlock
        </button>
      </div>
    </div>
  );
};

// Notification Stack
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const NotificationStack: React.FC<{
  notifications: Notification[];
  onDismiss: (id: string) => void;
  maxVisible?: number;
}> = ({ notifications, onDismiss, maxVisible = 3 }) => {
  const visible = notifications.slice(0, maxVisible);

  return (
    <div className="fixed top-20 right-4 z-40 space-y-3">
      {visible.map((notif, index) => (
        <div
          key={notif.id}
          className={`
            bg-gray-900 border border-gray-800 rounded-lg
            p-4 shadow-lg min-w-80 max-w-sm
            animate-slideInRight
            ${
              notif.type === 'success'
                ? 'border-green-500/30 bg-green-900/20'
                : notif.type === 'error'
                  ? 'border-red-500/30 bg-red-900/20'
                  : notif.type === 'warning'
                    ? 'border-yellow-500/30 bg-yellow-900/20'
                    : 'border-blue-500/30 bg-blue-900/20'
            }
          `}
          style={{
            animation: `slideInRight 0.3s ease-out`,
            animationDelay: `${index * 50}ms`,
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-white">{notif.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{notif.message}</p>
              <p className="text-xs text-gray-500 mt-2">
                {notif.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => onDismiss(notif.id)}
              className="ml-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {notif.action && (
            <button
              onClick={notif.action.onClick}
              className="mt-3 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white transition-colors"
            >
              {notif.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Enhanced Status Bar
export const EnhancedStatusBar: React.FC<{
  batteryLevel?: number;
  wifi?: boolean;
  bluetooth?: boolean;
  airplaneMode?: boolean;
  className?: string;
}> = ({
  batteryLevel = 85,
  wifi = true,
  bluetooth = false,
  airplaneMode = false,
  className = '',
}) => {
  return (
    <div
      className={`
        flex items-center justify-between px-4 py-2
        bg-gray-900/50 border-b border-gray-800
        text-xs text-gray-400
        ${className}
      `}
    >
      {/* Time */}
      <div className="font-medium">
        {new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>

      {/* Indicators */}
      <div className="flex items-center gap-2">
        {airplaneMode && <span>✈️</span>}
        {wifi && <span>📶</span>}
        {bluetooth && <span>🔵</span>}

        {/* Battery indicator */}
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 border border-gray-500 rounded-sm overflow-hidden">
            <div
              className={`h-full transition-colors ${
                batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${batteryLevel}%` }}
            />
          </div>
          <span>{batteryLevel}%</span>
        </div>
      </div>
    </div>
  );
};

// Quick Actions Panel
export const QuickActionsPanel: React.FC<{
  onClose?: () => void;
  className?: string;
}> = ({ onClose, className = '' }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [dnd, setDnd] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);

  const quickActions = [
    {
      icon: '🌙',
      label: 'Dark Mode',
      state: darkMode,
      onChange: setDarkMode,
    },
    {
      icon: '🔕',
      label: 'Do Not Disturb',
      state: dnd,
      onChange: setDnd,
    },
    {
      icon: '📶',
      label: 'Wi-Fi',
      state: wifi,
      onChange: setWifi,
    },
    {
      icon: '🔵',
      label: 'Bluetooth',
      state: bluetooth,
      onChange: setBluetooth,
    },
  ];

  return (
    <div
      className={`
        bg-gray-900 border border-gray-800 rounded-lg
        p-4 space-y-4
        ${className}
      `}
    >
      <h3 className="text-sm font-semibold text-gray-300">Quick Actions</h3>

      {/* Actions grid */}
      <div className="grid grid-cols-4 gap-2">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => action.onChange(!action.state)}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-lg
              transition-all duration-200
              ${
                action.state
                  ? 'bg-blue-600/20 border border-blue-500 text-blue-400'
                  : 'bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs text-center">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Brightness slider */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-400">Brightness</h4>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="80"
          className="w-full"
        />
      </div>

      {/* Volume slider */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-gray-400">Volume</h4>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="70"
          className="w-full"
        />
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 text-sm font-medium transition-colors"
        >
          Close
        </button>
      )}
    </div>
  );
};

// Today Widget Summary
export const TodayWidgetSummary: React.FC<{
  tasksCompleted: number;
  totalTasks: number;
  focusTime: number; // in minutes
  className?: string;
}> = ({ tasksCompleted, totalTasks, focusTime, className = '' }) => {
  return (
    <div
      className={`
        bg-gradient-to-br from-blue-900/30 to-purple-900/30
        border border-gray-800 rounded-lg p-4
        space-y-3
        ${className}
      `}
    >
      <h3 className="text-sm font-semibold text-white">Today's Summary</h3>

      <div className="space-y-2">
        {/* Tasks progress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Tasks</span>
            <span className="text-gray-300">
              {tasksCompleted}/{totalTasks}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
              style={{
                width: `${totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Focus time */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Focus Time</span>
          <span className="text-sm font-semibold text-blue-400">
            {Math.floor(focusTime / 60)}h {focusTime % 60}m
          </span>
        </div>
      </div>
    </div>
  );
};

export default {
  LockScreen,
  NotificationStack,
  EnhancedStatusBar,
  QuickActionsPanel,
  TodayWidgetSummary,
};
