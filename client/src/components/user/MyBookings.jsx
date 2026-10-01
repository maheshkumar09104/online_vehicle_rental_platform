import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyBookings = ({ onRefreshNotification }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      setCancellingId(bookingId);
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        onRefreshNotification && onRefreshNotification('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    return <span className={`badge badge-${s}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-3xl) 0' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-md)' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📑</div>
        <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          No Bookings Found
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
          You haven't made any vehicle reservations yet. Browse our collection and book your ride today!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>My Bookings ({bookings.length})</h3>
        <button className="btn btn-outline btn-sm" onClick={fetchBookings}>
          🔄 Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Rental Dates</th>
              <th>Duration</th>
              <th>Total Cost</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const startFormatted = new Date(booking.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const endFormatted = new Date(booking.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const isCancellable =
                booking.status !== 'Cancelled' && booking.status !== 'Completed';

              return (
                <tr key={booking._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={booking.vehicle?.imageUrl}
                        alt={booking.vehicle?.name || 'Vehicle'}
                        style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {booking.vehicle?.name || 'Unknown Vehicle'}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {booking.vehicle?.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-type">
                      {booking.vehicle?.type}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '13px' }}>{startFormatted}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>to {endFormatted}</div>
                  </td>
                  <td>
                    {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--primary-green)' }}>
                    ₹{booking.totalPrice}
                  </td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    {isCancellable ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                      >
                        {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Completed / Inactive
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBookings;
