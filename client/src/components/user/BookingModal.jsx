import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const BookingModal = ({ isOpen, onClose, vehicle, onBookingSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default start date to tomorrow or today
  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const formattedToday = today.toISOString().split('T')[0];
      const formattedTomorrow = tomorrow.toISOString().split('T')[0];

      setStartDate(formattedToday);
      setEndDate(formattedTomorrow);
      setError('');
    }
  }, [isOpen, vehicle]);

  // Recalculate duration & total price whenever dates change
  useEffect(() => {
    if (startDate && endDate && vehicle) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end > start) {
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTotalDays(days);
        setTotalPrice(days * vehicle.pricePerDay);
        setError('');
      } else {
        setTotalDays(0);
        setTotalPrice(0);
        if (endDate) {
          setError('Return date must be strictly after pickup date.');
        }
      }
    }
  }, [startDate, endDate, vehicle]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both pickup and return dates.');
      return;
    }

    if (totalDays <= 0) {
      setError('Return date must be after pickup date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/bookings', {
        vehicleId: vehicle._id,
        startDate,
        endDate,
      });

      if (response.data.success) {
        onBookingSuccess(response.data.message || 'Booking created successfully!');
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete booking. Please try different dates.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Vehicle">
      <div>
        {/* Vehicle Preview Card */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          backgroundColor: 'var(--bg-secondary)',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
        }}>
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
          />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
              {vehicle.brand} • {vehicle.type}
            </span>
            <h4 style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{vehicle.name}</h4>
            <div style={{ fontSize: '13px', color: 'var(--primary-green)', fontWeight: '600' }}>
              ₹{vehicle.pricePerDay} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>/ day</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: 'var(--danger-color)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            marginBottom: '16px',
            fontWeight: '500',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label">Pickup Date</label>
              <input
                type="date"
                className="form-input"
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Return Date</label>
              <input
                type="date"
                className="form-input"
                min={startDate || todayStr}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Pricing summary breakdown */}
          <div style={{
            borderTop: '1px solid var(--border-light)',
            borderBottom: '1px solid var(--border-light)',
            padding: '14px 0',
            marginBottom: '20px',
            fontSize: '14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <span>Duration</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                {totalDays} {totalDays === 1 ? 'day' : 'days'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <span>Daily Rate</span>
              <span>₹{vehicle.pricePerDay} / day</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '8px',
              borderTop: '1px dashed var(--border-light)',
              fontWeight: '700',
              fontSize: '16px',
              color: 'var(--text-primary)',
            }}>
              <span>Total Price</span>
              <span style={{ color: 'var(--primary-green)' }}>₹{totalPrice}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || totalDays <= 0}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-light" style={{ width: '16px', height: '16px' }}></span>
                  Confirming...
                </>
              ) : (
                `Confirm & Reserve (₹${totalPrice})`
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BookingModal;
