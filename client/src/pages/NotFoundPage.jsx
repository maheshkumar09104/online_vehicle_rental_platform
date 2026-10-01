import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-xl)',
      backgroundColor: 'var(--bg-secondary)',
    }}>
      <div className="card" style={{ maxWidth: '440px', padding: 'var(--space-2xl)' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>404</div>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
          The page you requested does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary" style={{ width: '100%' }}>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
