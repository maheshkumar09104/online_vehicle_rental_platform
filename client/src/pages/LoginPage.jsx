import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [wakeupMsg, setWakeupMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Success message passed from registration page
  const successNotice = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setWakeupMsg('');

    // Warn user early that free backend may be cold-starting
    const wakeupTimer = setTimeout(() => {
      setWakeupMsg('⏳ Server is waking up, please wait…');
    }, 5000);

    const res = await login(email.trim(), password);
    clearTimeout(wakeupTimer);
    setWakeupMsg('');
    setLoading(false);

    if (res.success && res.user) {
      // Role-based redirect
      if (res.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      // Show the real server error message
      setErrorMessage(res.message || 'Invalid email or password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-xl) var(--space-md)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: 'var(--space-2xl)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '54px',
              height: '54px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-green-light)',
              fontSize: '28px',
              marginBottom: '12px',
            }}
          >
            🚗
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Log in to manage your bookings or vehicle fleet
          </p>
        </div>

        {successNotice && !errorMessage && (
          <div
            style={{
              backgroundColor: 'var(--primary-green-light)',
              color: 'var(--primary-green-dark)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: '500',
            }}
          >
            ✅ {successNotice}
          </div>
        )}

        {wakeupMsg && !errorMessage && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: '500',
            }}
          >
            {wakeupMsg}
          </div>
        )}

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              color: 'var(--danger-color)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              marginBottom: '20px',
              fontWeight: '500',
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              required
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '12px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner spinner-light" style={{ width: '18px', height: '18px' }}></span>
                Logging in…
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-xl)',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary-green)' }}>
            Register as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
