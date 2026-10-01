import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserProfile = ({ onNotification }) => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Name and phone cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await updateProfile({ name, phone });
    setLoading(false);

    if (res.success) {
      setIsEditing(false);
      onNotification && onNotification(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>User Profile</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Manage your personal information and contact details
            </p>
          </div>
          {!isEditing && (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: 'var(--danger-color)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setName(user?.name || '');
                  setPhone(user?.phone || '');
                  setIsEditing(false);
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '13px' }}>Full Name</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{user?.name}</span>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '13px' }}>Email</span>
              <span style={{ color: 'var(--text-primary)' }}>{user?.email}</span>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '13px' }}>Phone</span>
              <span style={{ color: 'var(--text-primary)' }}>{user?.phone}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '140px', color: 'var(--text-muted)', fontSize: '13px' }}>Account Role</span>
              <span className="badge badge-confirmed" style={{ textTransform: 'capitalize' }}>
                {user?.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
