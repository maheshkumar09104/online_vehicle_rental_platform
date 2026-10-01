import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import AdminVehicles from '../components/admin/AdminVehicles';
import AdminBookings from '../components/admin/AdminBookings';
import AdminUsers from '../components/admin/AdminUsers';
import Toast from '../components/common/Toast';
import api from '../services/api';

const AdminDashboardPage = () => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [vehiclesRes, bookingsRes, usersRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/bookings/all'),
        api.get('/users'),
      ]);

      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.vehicles);
      if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
      if (usersRes.data.success) setUsers(usersRes.data.users);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error loading administrative data from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-secondary)' }}>
      {/* 30% Green Admin Sidebar */}
      <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        {/* Top Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          padding: 'var(--space-md) var(--space-xl)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', textTransform: 'capitalize' }}>
              {currentTab}
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              AutoRent Administrative Management Suite
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-outline btn-sm" onClick={fetchAdminData} disabled={loading}>
              🔄 Sync Data
            </button>
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <main style={{ padding: 'var(--space-xl)', flex: 1 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              {currentTab === 'overview' && (
                <AdminOverview
                  vehicles={vehicles}
                  bookings={bookings}
                  users={users}
                />
              )}

              {currentTab === 'vehicles' && (
                <AdminVehicles
                  vehicles={vehicles}
                  onRefresh={fetchAdminData}
                  onNotification={(msg) => showToast(msg, 'success')}
                />
              )}

              {currentTab === 'bookings' && (
                <AdminBookings
                  bookings={bookings}
                  onRefresh={fetchAdminData}
                  onNotification={(msg) => showToast(msg, 'success')}
                />
              )}

              {currentTab === 'users' && (
                <AdminUsers
                  users={users}
                  onRefresh={fetchAdminData}
                  onNotification={(msg) => showToast(msg, 'success')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Admin Toast */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
};

export default AdminDashboardPage;
