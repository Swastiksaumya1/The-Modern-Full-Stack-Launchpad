import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (resetMode) {
        await resetPassword(email);
        setResetSent(true);
      } else if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          throw new Error('Please enter your name');
        }
        await signup(email, password, displayName);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      // Clean up Firebase error messages
      if (errorMessage.includes('auth/email-already-in-use')) {
        setError('Email already registered. Try logging in.');
      } else if (errorMessage.includes('auth/weak-password')) {
        setError('Password should be at least 6 characters.');
      } else if (errorMessage.includes('auth/invalid-email')) {
        setError('Invalid email address.');
      } else if (errorMessage.includes('auth/invalid-credential')) {
        setError('Invalid email or password.');
      } else if (errorMessage.includes('auth/user-not-found')) {
        setError('No account found with this email.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic gradient based on time
  const hour = new Date().getHours();
  const isNight = hour < 6 || hour >= 20;
  const isSunset = hour >= 17 && hour < 20;
  
  const gradientBg = isNight 
    ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    : isSunset 
    ? 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 50%, #ff6b6b 100%)'
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';

  return (
    <div style={{
      minHeight: '100vh',
      background: gradientBg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Stars for night mode */}
      {isNight && (
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(50)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: 'white',
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          }}>
            <span style={{ fontSize: '28px' }}>🎯</span>
          </div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 700, margin: 0 }}>
            FocusOS
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '8px', fontSize: '14px' }}>
            {resetMode ? 'Reset your password' : isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {/* Reset Success Message */}
        {resetSent && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.5)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#86efac',
            fontSize: '14px',
          }}>
            ✓ Password reset email sent! Check your inbox.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#fca5a5',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name field (signup only) */}
          {!isLogin && !resetMode && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0 16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <User size={20} color="rgba(255,255,255,0.5)" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    padding: '14px 12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0 16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Mail size={20} color="rgba(255,255,255,0.5)" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  padding: '14px 12px',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password field (not for reset mode) */}
          {!resetMode && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '0 16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}>
                <Lock size={20} color="rgba(255,255,255,0.5)" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    padding: '14px 12px',
                    color: 'white',
                    fontSize: '15px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="rgba(255,255,255,0.5)" />
                  ) : (
                    <Eye size={20} color="rgba(255,255,255,0.5)" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          {isLogin && !resetMode && (
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => { setResetMode(true); setError(''); setResetSent(false); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading && <Loader2 size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />}
            {resetMode ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        {!resetMode && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              gap: '12px',
            }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }} />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {/* Toggle Login/Signup or Back from Reset */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          {resetMode ? (
            <button
              onClick={() => { setResetMode(false); setError(''); setResetSent(false); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              ← Back to login
            </button>
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* CSS Animation for spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}

