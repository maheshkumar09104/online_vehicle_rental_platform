import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'bookings', label: 'Bookings', icon: '📑' },
    { id: 'users', label: 'Users', icon: '👥' },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--primary-green)',
      color: '#FFFFFF',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-lg) var(--space-md)',
      flexShrink: 0,
    }}>
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2xl)', padding: '0 8px' }}>
        <span style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          padding: '6px 8px',
          borderRadius: '8px',
          fontSize: '20px',
        }}>
          🚗
        </span>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>
            Auto<span style={{ color: '#A7F3D0' }}>Rent</span>
          </h2>
          <span style={{ fontSize: '11px', opacity: 0.85, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.22)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                fontSize: '14px',
                textAlign: 'left',
                width: '100%',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin User Info & Controls */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        paddingTop: 'var(--space-md)',
        marginTop: 'auto',
      }}>
        <div style={{ padding: '0 8px 12px' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>{user?.name}</div>
          <div style={{ fontSize: '11px', opacity: 0.85 }}>{user?.email}</div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link
            to="/dashboard"
            style={{
              flex: 1,
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: '500',
            }}
          >
            Live Site
          </Link>
          <button
            onClick={handleLogout}
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              color: 'var(--primary-green-dark)',
              padding: '8px',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
