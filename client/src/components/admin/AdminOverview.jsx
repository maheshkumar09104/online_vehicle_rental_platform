import React from 'react';
import StatCard from '../common/StatCard';

const AdminOverview = ({ vehicles, bookings, users }) => {
  // Calculate total revenue from non-cancelled bookings
  const totalRevenue = bookings.reduce((sum, b) => {
    if (b.status === 'Confirmed' || b.status === 'Completed') {
      return sum + (b.totalPrice || 0);
    }
    return sum;
  }, 0);

  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pending').length;

  const recentBookings = [...bookings].slice(0, 5);

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    return <span className={`badge badge-${s}`}>{status}</span>;
  };

  return (
    <div>
      {/* 4 Stat Cards */}
      <div className="grid-stats" style={{ marginBottom: 'var(--space-2xl)' }}>
        <StatCard
          title="Total Vehicles"
          value={vehicles.length}
          icon="🚗"
          subtitle={`${vehicles.filter((v) => v.isAvailable).length} Available`}
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon="📑"
          subtitle={`${pendingBookingsCount} Pending Review`}
        />
        <StatCard
          title="Total Users"
          value={users.length}
          icon="👥"
          subtitle="Registered accounts"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          icon="💰"
          subtitle="Confirmed & Completed"
        />
      </div>

      {/* Recent Bookings Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Bookings</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Latest customer reservations across all vehicles</p>
          </div>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            No bookings recorded yet.
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Customer</th>
                  <th>Rental Dates</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={b.vehicle?.imageUrl}
                          alt={b.vehicle?.name}
                          style={{ width: '40px', height: '30px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <span style={{ fontWeight: '500' }}>{b.vehicle?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td>
                      <div>{b.user?.name || 'Customer'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}>
                        {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{b.totalDays} days</div>
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--primary-green)' }}>
                      ₹{b.totalPrice}
                    </td>
                    <td>{getStatusBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
