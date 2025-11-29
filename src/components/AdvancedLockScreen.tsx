import React, { useState, useEffect, useRef } from 'react';
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
    focusTimeToday: number;
    productivity: number;
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
  const touchStartRef = useRef(0);

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => {
      setTime(new Date());
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    touchStartRef.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = e.clientY - touchStartRef.current;
    if (delta < 0) {
      setDragY(Math.min(Math.abs(delta), 150));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (dragY > 100) {
      onUnlock();
    }
    setDragY(0);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    touchStartRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientY - touchStartRef.current;
    if (delta < 0) {
      setDragY(Math.min(Math.abs(delta), 150));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 100) {
      onUnlock();
    }
    setDragY(0);
  };

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

  const getEventColor = (colorHex: string) => {
    if (colorHex === '#3b82f6') return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', dot: '#3b82f6' };
    if (colorHex === '#10b981') return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', dot: '#10b981' };
    if (colorHex === '#8b5cf6') return { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', dot: '#8b5cf6' };
    return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', dot: '#3b82f6' };
  };

  if (!isLocked) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'linear-gradient(135deg, #0f0a1a 0%, #1a0f3a 50%, #0f0a1a 100%)',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Animated background elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '40px',
            width: '288px',
            height: '288px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '40px',
            width: '384px',
            height: '384px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            animation: 'pulse 8s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
      </div>

      {/* Main content - center */}
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        {/* Large clock display */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
            userSelect: 'none',
            transform: `translateY(-${dragY}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {/* Time */}
          <div style={{ fontSize: '120px', fontWeight: 900, color: 'white', textShadow: '0 20px 40px rgba(0,0,0,0.5)', letterSpacing: '-2px', lineHeight: 1 }}>
            {formattedTime}
          </div>

          {/* Date */}
          <div style={{ fontSize: '24px', color: 'rgb(209, 213, 219)', marginTop: '16px', fontWeight: 300, letterSpacing: '0.1em' }}>
            {formattedDate}
          </div>

          {/* Greeting */}
          <div style={{ fontSize: '18px', color: 'rgb(156, 163, 175)', marginTop: '8px' }}>
            Good {time.getHours() < 12 ? 'Morning' : time.getHours() < 18 ? 'Afternoon' : 'Evening'}, {userName}
          </div>
        </div>

        {/* Swipe up indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '128px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            animation: 'bounce 2s infinite',
          }}
        >
          <span style={{ fontSize: '14px', color: 'rgb(156, 163, 175)' }}>Swipe up to unlock</span>
          <ChevronUp style={{ color: 'rgb(96, 165, 250)', animation: 'bounce 2s infinite' }} size={24} />
        </div>
      </div>

      {/* Bottom panel - Calendar Events & Stats */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(30,30,45,0.8), transparent)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          maxHeight: '384px',
          overflowY: 'auto',
          transform: `translateY(${dragY > 0 ? -dragY : 0}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          opacity: Math.max(0.2, 1 - dragY / 200),
          pointerEvents: dragY > 50 ? 'none' : 'auto',
        }}
      >
        {/* Today's Stats */}
        {(focusStats.tasksCompleted > 0 || focusStats.focusTimeToday > 0) && (
          <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {/* Tasks */}
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'rgb(134, 239, 172)' }}>{focusStats.tasksCompleted}</div>
              <div style={{ fontSize: '12px', color: 'rgb(134, 239, 172)', marginTop: '4px' }}>Tasks Done</div>
            </div>

            {/* Focus Time */}
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'rgb(147, 197, 253)' }}>
                {Math.floor(focusStats.focusTimeToday / 60)}h
              </div>
              <div style={{ fontSize: '12px', color: 'rgb(147, 197, 253)', marginTop: '4px' }}>Focus Time</div>
            </div>

            {/* Productivity */}
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'rgb(196, 181, 253)' }}>{focusStats.productivity}%</div>
              <div style={{ fontSize: '12px', color: 'rgb(196, 181, 253)', marginTop: '4px' }}>Productivity</div>
            </div>
          </div>
        )}

        {/* Calendar Events */}
        {calendarEvents.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(209, 213, 219)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Upcoming Events
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {calendarEvents.slice(0, 4).map(event => {
                const colors = getEventColor(event.color);
                return (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px',
                      borderRadius: '8px',
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        marginTop: '6px',
                        flexShrink: 0,
                        backgroundColor: colors.dot,
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: 'white' }}>{event.title}</div>
                      <div style={{ fontSize: '12px', color: 'rgb(156, 163, 175)' }}>{event.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Notifications */}
        {notifications.length > 0 && (
          <div>
            <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(209, 213, 219)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Notifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notifications.slice(0, 3).map(notif => (
                <div
                  key={notif.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', color: 'white' }}>{notif.title}</div>
                    <div style={{ fontSize: '12px', color: 'rgb(156, 163, 175)' }}>{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Unlock progress bar */}
      {dragY > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '4px',
            width: `${(dragY / 150) * 100}%`,
            background: 'linear-gradient(to right, transparent, rgb(59, 130, 246), transparent)',
            transition: isDragging ? 'none' : 'width 0.3s ease-out',
          }}
        />
      )}

      {/* Emergency unlock button */}
      <button
        onClick={onUnlock}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '8px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'rgba(255,255,255,0.5)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
        }}
        title="Click to unlock"
      >
        <X size={20} />
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

export default AdvancedLockScreen;
