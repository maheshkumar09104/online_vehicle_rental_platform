import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: 'var(--primary-green)',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
      }}>
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin' : '/dashboard'} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#FFFFFF',
          fontSize: '20px',
          fontWeight: '700',
          textDecoration: 'none',
        }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '6px 8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            🚗
          </span>
          <span>Auto<span style={{ color: '#A7F3D0' }}>Rent</span></span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {isAuthenticated ? (
            <>
              {!isAdmin && setActiveTab && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActiveTab('vehicles')}
                    style={{
                      background: activeTab === 'vehicles' ? 'rgba(255,255,255,0.25)' : 'transparent',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: activeTab === 'vehicles' ? '600' : '400',
                    }}
                  >
                    Vehicles
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    style={{
                      background: activeTab === 'bookings' ? 'rgba(255,255,255,0.25)' : 'transparent',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: activeTab === 'bookings' ? '600' : '400',
                    }}
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    style={{
                      background: activeTab === 'profile' ? 'rgba(255,255,255,0.25)' : 'transparent',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: activeTab === 'profile' ? '600' : '400',
                    }}
                  >
                    Profile
                  </button>
                </div>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  Admin Panel
                </Link>
              )}

              {/* User greeting & logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '16px' }}>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', lineHeight: 1.2 }}>{user?.name}</span>
                  <span style={{ fontSize: '11px', opacity: 0.85, textTransform: 'capitalize' }}>
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: '#FFFFFF',
                    color: 'var(--primary-green-dark)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/login" style={{
                color: '#FFFFFF',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
              }}>
                Login
              </Link>
              <Link to="/register" style={{
                backgroundColor: '#FFFFFF',
                color: 'var(--primary-green)',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
              }}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
