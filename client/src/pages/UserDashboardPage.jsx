import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import VehicleCard from '../components/user/VehicleCard';
import BookingModal from '../components/user/BookingModal';
import MyBookings from '../components/user/MyBookings';
import UserProfile from '../components/user/UserProfile';
import Toast from '../components/common/Toast';
import api from '../services/api';

const UserDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('vehicles'); // 'vehicles' | 'bookings' | 'profile'
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState(10000);

  // Booking modal state
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Fetch vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vehicles');
      if (res.data.success) {
        setVehicles(res.data.vehicles);
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      showToast('Failed to load vehicles from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenBookingModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = (msg) => {
    showToast(msg, 'success');
    fetchVehicles();
  };

  // Filter vehicles based on search, type, and max price
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      selectedType === 'all' || v.type.toLowerCase() === selectedType.toLowerCase();
    const matchesPrice = v.pricePerDay <= priceRange;

    return matchesSearch && matchesType && matchesPrice;
  });

  const vehicleTypes = [
    { id: 'all', label: 'All Vehicles' },
    { id: 'car', label: 'Cars' },
    { id: 'suv', label: 'SUVs' },
    { id: 'bike', label: 'Bikes' },
    { id: 'van', label: 'Vans' },
  ];

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="main-content" style={{ padding: 'var(--space-xl) 0 var(--space-3xl)' }}>
        <div className="container">
          {/* TAB 1: VEHICLES BROWSER */}
          {activeTab === 'vehicles' && (
            <>
              {/* Hero Banner */}
              <div style={{
                backgroundColor: 'var(--primary-green)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-2xl) var(--space-xl)',
                marginBottom: 'var(--space-2xl)',
                background: 'var(--green-gradient)',
                boxShadow: 'var(--shadow-md)',
              }}>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Premium Fleet Rental
                </span>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', marginTop: '12px', marginBottom: '8px' }}>
                  Find the Perfect Ride for Your Journey
                </h1>
                <p style={{ color: '#E6F4EC', fontSize: '15px', maxWidth: '600px' }}>
                  Choose from luxury electric cars, powerful SUVs, agile superbikes, and spacious touring vans at transparent daily rates.
                </p>
              </div>

              {/* Filters and Search Bar */}
              <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 'var(--space-md)',
                  alignItems: 'center',
                }}>
                  {/* Search Input */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Search Vehicle</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search by name or brand..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Type Filter Pills */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {vehicleTypes.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedType(t.id)}
                          className={selectedType === t.id ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter Slider */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="form-label">Max Price / Day</label>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary-green)' }}>
                        ₹{priceRange}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="15000"
                      step="250"
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary-green)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* Vehicles Card Grid */}
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3xl) 0' }}>
                  <div className="spinner"></div>
                </div>
              ) : filteredVehicles.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-md)' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>No vehicles match your search criteria</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Try adjusting your filters, price range, or search keywords.
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSearch('');
                      setSelectedType('all');
                      setPriceRange(10000);
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid-vehicles">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle._id}
                      vehicle={vehicle}
                      onSelectBooking={handleOpenBookingModal}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <MyBookings onRefreshNotification={(msg) => showToast(msg, 'info')} />
          )}

          {/* TAB 3: USER PROFILE */}
          {activeTab === 'profile' && (
            <UserProfile onNotification={(msg) => showToast(msg, 'success')} />
          )}
        </div>
      </main>

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <Footer />
    </div>
  );
};

export default UserDashboardPage;
