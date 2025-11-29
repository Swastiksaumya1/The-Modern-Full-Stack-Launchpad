import React, { useState } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import AuthPage from './components/Auth/AuthPage'
import { ThemeProvider, useTheme } from './components/Personalization'
import { EnhancedStatusBar, NotificationStack, LockScreen } from './components/BonusOSFeatures'
import { Navigation } from './components/Navigation'
import { GridLayout } from './components/GridLayout'

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

// Protected App Content with Theme
function AppContent() {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme();
  const [isLocked, setIsLocked] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [editMode, setEditMode] = useState(false);

  // Add notification
  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [{ ...notif, id, timestamp: new Date() }, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(255,255,255,0.2)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!currentUser) {
    return <AuthPage />;
  }

  // Show lock screen if locked
  if (isLocked) {
    return (
      <LockScreen
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
      />
    );
  }

  // Show dashboard with enhanced OS features
  return (
    <div
      className={`min-h-screen transition-colors ${
        theme === 'dark' ? 'bg-gray-950 text-white' :
        theme === 'amoled' ? 'bg-black text-white' :
        theme === 'pastel' ? 'bg-blue-50 text-gray-900' :
        'bg-white text-gray-900'
      }`}
    >
      {/* Status Bar */}
      <EnhancedStatusBar
        batteryLevel={85}
        wifi={true}
        bluetooth={false}
        airplaneMode={false}
      />

      {/* Navigation */}
      <Navigation
        editMode={editMode}
        onEditModeToggle={() => setEditMode(!editMode)}
        onLockClick={() => setIsLocked(true)}
      />

      {/* Main Content Area */}
      <main className="pt-20 pb-8">
        {/* Grid Layout for Dashboard */}
        <div className="max-w-7xl mx-auto px-4">
          <Dashboard
            editMode={editMode}
          />
        </div>
      </main>

      {/* Notification Stack */}
      <NotificationStack
        notifications={notifications}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
      />
    </div>
  );
}

// App wrapper with theme provider
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

