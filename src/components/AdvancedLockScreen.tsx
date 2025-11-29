import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronUp, Clock, CheckSquare, Bell } from 'lucide-react';

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
  notifications?: Array<{
    id: string;
    title: string;
    time: string;
  }>;
  pendingTasks?: Array<{
    id: string;
    text: string;
    priority?: 'low' | 'medium' | 'high';
  }>;
  timerActive?: boolean;
  timerTime?: string;
  stopwatchTime?: string;
  stopwatchActive?: boolean;
}

export const AdvancedLockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  userName = 'User',
  calendarEvents = [],
  notifications = [],
  pendingTasks = [],
  timerActive = false,
  timerTime = '',
  stopwatchTime = '',
  stopwatchActive = false,
}) => {
  const [time, setTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showNotifications, setShowNotifications] = useState(true);
  const touchStartRef = useRef(0);

  useEffect(() => {
    if (!isLocked) return;
    const timer = setInterval(() => {
      setTime(new Date());
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isLocked]);

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

  if (!isLocked) return null;

  const getPriorityColor = (priority?: string) => {
    if (priority === 'high') return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', dot: '#ef4444' };
    if (priority === 'medium') return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', dot: '#f59e0b' };
    return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', dot: '#3b82f6' };
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'linear-gradient(135deg, #0f0a1a 0%, #1a0f3a 50%, #0f0a1a 100%)',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
      }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest('[data-notif-panel]')) return;
        setIsDragging(true);
        touchStartRef.current = e.clientY;
      }}
      onMouseMove={(e) => {
        if (!isDragging) return;
        const delta = e.clientY - touchStartRef.current;
        if (delta < 0) {
          setDragY(Math.min(Math.abs(delta), 150));
        }
      }}
      onMouseUp={() => {
        setIsDragging(false);
        if (dragY > 100) {
          onUnlock();
        }
        setDragY(0);
      }}
      onMouseLeave={() => {
        setIsDragging(false);
        if (dragY > 100) {
          onUnlock();
        }
        setDragY(0);
      }}
      onTouchStart={(e) => {
        if ((e.target as HTMLElement).closest('[data-notif-panel]')) return;
        setIsDragging(true);
        touchStartRef.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        if (!isDragging) return;
        const delta = e.touches[0].clientY - touchStartRef.current;
        if (delta < 0) {
          setDragY(Math.min(Math.abs(delta), 150));
        }
      }}
      onTouchEnd={() => {
        setIsDragging(false);
        if (dragY > 100) {
          onUnlock();
        }
        setDragY(0);
      }}
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

      {/* Main clock area - 3/4 width */}
      <div
        style={{
          flex: '0 0 75%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          position: 'relative',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            userSelect: 'none',
            transform: `translateY(-${dragY}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {/* Time - Main display */}
          <div style={{ fontSize: '140px', fontWeight: 900, color: 'white', textShadow: '0 20px 60px rgba(0,0,0,0.6)', letterSpacing: '-4px', lineHeight: 0.9 }}>
            {formattedTime}
          </div>

          {/* Date */}
          <div style={{ fontSize: '28px', color: 'rgb(209, 213, 219)', marginTop: '24px', fontWeight: 300, letterSpacing: '0.05em' }}>
            {formattedDate}
          </div>

          {/* Timer or Stopwatch if active */}
          {(timerActive || stopwatchActive) && (
            <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
                <Clock size={20} style={{ color: 'rgb(96, 165, 250)' }} />
                <span style={{ fontSize: '12px', color: 'rgb(156, 163, 175)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {timerActive ? 'Timer' : 'Stopwatch'}
                </span>
              </div>
              <div style={{ fontSize: '48px', fontWeight: 700, color: 'rgb(147, 197, 253)', fontFamily: 'monospace' }}>
                {timerActive ? timerTime : stopwatchTime}
              </div>
            </div>
          )}

          {/* Greeting */}
          <div style={{ fontSize: '18px', color: 'rgb(156, 163, 175)', marginTop: '24px', fontWeight: 300 }}>
            Good {time.getHours() < 12 ? 'Morning' : time.getHours() < 18 ? 'Afternoon' : 'Evening'}, {userName}
          </div>
        </div>

        {/* Swipe up indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
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

      {/* Right panel - 1/4 width - Notifications/Events/Tasks */}
      <div
        data-notif-panel
        style={{
          flex: '0 0 25%',
          background: 'linear-gradient(to left, rgba(0,0,0,0.8), rgba(0,0,0,0.4))',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          position: 'relative',
        }}
      >
        {/* Toggle button */}
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: 'rgb(147, 197, 253)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
          }}
        >
          <Bell size={16} />
          {showNotifications ? 'Notifications' : 'Tasks & Events'}
        </button>

        {/* Notifications view (default) */}
        {showNotifications && (
          <>
            {notifications.length > 0 ? (
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(209, 213, 219)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Notifications
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.slice(0, 5).map(notif => (
                    <div
                      key={notif.id}
                      style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                      }}
                    >
                      <div style={{ fontSize: '13px', color: 'white', fontWeight: 500 }}>{notif.title}</div>
                      <div style={{ fontSize: '11px', color: 'rgb(156, 163, 175)', marginTop: '4px' }}>{notif.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgb(107, 114, 128)' }}>
                <Bell size={24} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <div style={{ fontSize: '12px' }}>No notifications</div>
              </div>
            )}
          </>
        )}

        {/* Tasks & Events view */}
        {!showNotifications && (
          <>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(209, 213, 219)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Pending Tasks
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pendingTasks.slice(0, 4).map(task => {
                    const colors = getPriorityColor(task.priority);
                    return (
                      <div
                        key={task.id}
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '10px',
                          background: colors.bg,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = colors.bg.replace('0.1', '0.15');
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = colors.bg;
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
                        <div style={{ fontSize: '13px', color: 'white' }}>{task.text}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Calendar Events */}
            {calendarEvents.length > 0 && (
              <div>
                <h3 style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(209, 213, 219)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Today's Events
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {calendarEvents.slice(0, 4).map(event => {
                    const colors = {
                      blue: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', dot: '#3b82f6' },
                      green: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', dot: '#10b981' },
                      purple: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.3)', dot: '#8b5cf6' },
                    };
                    const eventColor = event.color === '#10b981' ? colors.green : event.color === '#8b5cf6' ? colors.purple : colors.blue;
                    
                    return (
                      <div
                        key={event.id}
                        style={{
                          display: 'flex',
                          gap: '10px',
                          padding: '10px',
                          background: eventColor.bg,
                          border: `1px solid ${eventColor.border}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = eventColor.bg.replace('0.1', '0.15');
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = eventColor.bg;
                        }}
                      >
                        <div
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            marginTop: '6px',
                            flexShrink: 0,
                            backgroundColor: eventColor.dot,
                          }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', color: 'white', fontWeight: 500 }}>{event.title}</div>
                          <div style={{ fontSize: '11px', color: 'rgb(156, 163, 175)' }}>{event.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {pendingTasks.length === 0 && calendarEvents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgb(107, 114, 128)' }}>
                <CheckSquare size={24} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <div style={{ fontSize: '12px' }}>No tasks or events</div>
              </div>
            )}
          </>
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
            zIndex: 51,
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
          zIndex: 52,
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
