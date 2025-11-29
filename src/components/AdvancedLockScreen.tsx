import React, { useState, useEffect } from 'react';
import { X, ChevronUp } from 'lucide-react';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  userName?: string;
  calendarEvents?: Array<{
    id: string;
    title: string;
    time: string;
    color: string;
  }>;
  focusStats?: {
    tasksCompleted: number;
    focusTimeToday: number; // in minutes
    productivity: number; // 0-100
  };
  notifications?: Array<{
    id: string;
    title: string;
    time: string;
  }>;
}

export const AdvancedLockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  userName = 'User',
  calendarEvents = [],
  focusStats = { tasksCompleted: 0, focusTimeToday: 0, productivity: 0 },
  notifications = [],
}) => {
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  // Update time and date
  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      setTime(new Date());
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  if (!isLocked) return null;

  // Handle mouse/touch drag to unlock
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setTouchStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const delta = e.clientY - touchStartY;
    // Allow dragging up (negative values)
    if (delta < 0) {
      setDragY(Math.min(Math.abs(delta), 150));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // If dragged far enough, unlock
    if (dragY > 100) {
      onUnlock();
      setDragY(0);
    } else {
      // Snap back
      setDragY(0);
    }
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const delta = e.touches[0].clientY - touchStartY;
    if (delta < 0) {
      setDragY(Math.min(Math.abs(delta), 150));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (dragY > 100) {
      onUnlock();
      setDragY(0);
    } else {
      setDragY(0);
    }
  };

  // Format time with larger font
  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-gray-950 via-blue-900/20 to-gray-950 overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content - center */}
      <div className="relative h-full flex flex-col items-center justify-center px-4">
        {/* Large clock display */}
        <div className="text-center mb-8 select-none" style={{ transform: `translateY(-${dragY}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease-out' }}>
          {/* Time */}
          <div className="text-9xl font-black text-white drop-shadow-2xl tracking-tighter">
            {formattedTime}
          </div>

          {/* Date */}
          <div className="text-2xl text-gray-300 mt-4 font-light tracking-wide">
            {formattedDate}
          </div>

          {/* Location/Greeting */}
          <div className="text-lg text-gray-400 mt-2">
            Good {time.getHours() < 12 ? 'Morning' : time.getHours() < 18 ? 'Afternoon' : 'Evening'}, {userName}
          </div>
        </div>

        {/* Swipe up indicator */}
        <div className="absolute bottom-32 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-gray-400">Swipe up to unlock</span>
          <ChevronUp className="text-blue-400" size={24} />
        </div>
      </div>

      {/* Bottom panel - Calendar Events & Stats */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-gray-900/80 to-transparent backdrop-blur-lg border-t border-white/10 p-6 max-h-96 overflow-y-auto"
        style={{
          transform: `translateY(${dragY > 0 ? -dragY : 0}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          opacity: 1 - dragY / 200,
        }}
      >
        {/* Today's Stats */}
        {(focusStats.tasksCompleted > 0 || focusStats.focusTimeToday > 0) && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            {/* Tasks */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{focusStats.tasksCompleted}</div>
              <div className="text-xs text-green-300 mt-1">Tasks Done</div>
            </div>

            {/* Focus Time */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.floor(focusStats.focusTimeToday / 60)}h
              </div>
              <div className="text-xs text-blue-300 mt-1">Focus Time</div>
            </div>

            {/* Productivity */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{focusStats.productivity}%</div>
              <div className="text-xs text-purple-300 mt-1">Productivity</div>
            </div>
          </div>
        )}

        {/* Calendar Events */}
        {calendarEvents.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Upcoming Events
            </h3>
            <div className="space-y-2">
              {calendarEvents.slice(0, 4).map(event => (
                <div
                  key={event.id}
                  className={`flex items-start gap-3 p-3 rounded-lg ${event.color}`}
                >
                  <div
                    className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      backgroundColor:
                        event.color === 'bg-red-500/10'
                          ? '#ef4444'
                          : event.color === 'bg-blue-500/10'
                            ? '#3b82f6'
                            : '#8b5cf6',
                    }}
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{event.title}</div>
                    <div className="text-xs text-gray-400">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Notifications
            </h3>
            <div className="space-y-2">
              {notifications.slice(0, 3).map(notif => (
                <div
                  key={notif.id}
                  className="flex items-start justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <div className="text-sm text-white">{notif.title}</div>
                    <div className="text-xs text-gray-400">{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Unlock progress bar (visual feedback) */}
      {dragY > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" style={{ width: `${(dragY / 150) * 100}%` }} />
      )}

      {/* Emergency unlock button (for accessibility) */}
      <button
        onClick={onUnlock}
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/50 hover:text-white"
        title="Click to unlock"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default AdvancedLockScreen;
