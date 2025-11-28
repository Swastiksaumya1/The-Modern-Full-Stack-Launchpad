import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import AuthPage from './components/Auth/AuthPage'

// Protected App Content
function AppContent() {
  const { currentUser, loading } = useAuth();

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

  // Show dashboard if logged in
  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

