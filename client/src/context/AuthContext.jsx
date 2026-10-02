import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('token', receivedToken);
        localStorage.setItem('user', JSON.stringify(receivedUser));
        return { success: true, user: receivedUser };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      // Show the real backend message so the user knows exactly what went wrong
      const message =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED' || err.message?.includes('timeout')
          ? 'The server is taking too long to respond. It may be waking up — please try again in 30–60 seconds.'
          : 'Unable to reach the server. Please check your connection.');
      return { success: false, message };
    }
  };

  // Register handler (User role only – role is always forced to "user" on the server)
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      return { success: true, message: res.data.message || 'Registration successful!' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED' || err.message?.includes('timeout')
          ? 'The server is taking too long to respond. It may be waking up — please try again in 30–60 seconds.'
          : 'Unable to reach the server. Please check your connection.');
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/users/profile', profileData);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        return { success: true, message: 'Profile updated successfully' };
      }
      return { success: false, message: 'Failed to update profile' };
    } catch (err) {
      const message = err.response?.data?.message || 'Error updating profile';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
