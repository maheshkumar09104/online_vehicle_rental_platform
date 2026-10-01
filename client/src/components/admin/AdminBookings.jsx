import React, { useState } from 'react';
import api from '../../services/api';

const AdminBookings = ({ bookings, onRefresh, onNotification }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const res = await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data.success) {
        onNotification(`Booking status updated to ${newStatus}`);
        onRefresh();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    return <span className={`badge badge-${s}`}>{status}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Manage All Bookings ({bookings.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Review and manage customer reservations</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Dates</th>
              <th>Total</th>
              <th>Current Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={b.vehicle?.imageUrl}
                      alt={b.vehicle?.name}
                      style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{b.vehicle?.name || 'N/A'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.vehicle?.brand}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: '500' }}>{b.user?.name || 'Customer'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.user?.phone}</div>
                </td>
                <td>
                  <div style={{ fontSize: '13px' }}>
                    {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {b.totalDays} {b.totalDays === 1 ? 'day' : 'days'}
                  </div>
                </td>
                <td style={{ fontWeight: '700', color: 'var(--primary-green)' }}>
                  ₹{b.totalPrice}
                </td>
                <td>{getStatusBadge(b.status)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {b.status === 'Pending' && (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusChange(b._id, 'Confirmed')}
                          disabled={updatingId === b._id}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusChange(b._id, 'Cancelled')}
                          disabled={updatingId === b._id}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {b.status === 'Confirmed' && (
                      <>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleStatusChange(b._id, 'Completed')}
                          disabled={updatingId === b._id}
                        >
                          Mark Completed
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusChange(b._id, 'Cancelled')}
                          disabled={updatingId === b._id}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {(b.status === 'Completed' || b.status === 'Cancelled') && (
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '12px', width: '130px' }}
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        disabled={updatingId === b._id}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                      </select>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
