import React, { useState } from 'react';
import api from '../../services/api';

const AdminUsers = ({ users, onRefresh, onNotification }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (user) => {
    if (user.role === 'admin' || user.email === 'admin123@gmail.com') {
      alert('The admin account cannot be deleted.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${user.name}"?`)) return;

    try {
      setDeletingId(user._id);
      const res = await api.delete(`/users/${user._id}`);
      if (res.data.success) {
        onNotification('User deleted successfully');
        onRefresh();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Registered Users ({users.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Manage user accounts and access permissions</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isAdminAccount = u.role === 'admin' || u.email === 'admin123@gmail.com';
              return (
                <tr key={u._id}>
                  <td style={{ fontWeight: '600' }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>
                    <span className={`badge ${isAdminAccount ? 'badge-confirmed' : 'badge-type'}`} style={{ textTransform: 'capitalize' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    {isAdminAccount ? (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Protected Admin
                      </span>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u)}
                        disabled={deletingId === u._id}
                      >
                        {deletingId === u._id ? 'Deleting...' : 'Delete User'}
                      </button>
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

export default AdminUsers;
