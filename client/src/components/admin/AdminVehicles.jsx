import React, { useState } from 'react';
import VehicleFormModal from './VehicleFormModal';
import api from '../../services/api';

const AdminVehicles = ({ vehicles, onRefresh, onNotification }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleAddNew = () => {
    setSelectedVehicle(null);
    setModalOpen(true);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to permanently delete this vehicle?')) return;

    try {
      setDeletingId(vehicleId);
      const res = await api.delete(`/vehicles/${vehicleId}`);
      if (res.data.success) {
        onNotification('Vehicle deleted successfully');
        onRefresh();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete vehicle');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalSuccess = (msg) => {
    onNotification(msg);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Manage Vehicles ({vehicles.length})</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Add, edit, or remove fleet inventory</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Vehicle
        </button>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Daily Rate</th>
              <th>Seats</th>
              <th>Fuel</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600' }}>{v.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{v.brand}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-type">{v.type}</span>
                </td>
                <td style={{ fontWeight: '600', color: 'var(--primary-green)' }}>
                  ₹{v.pricePerDay}
                </td>
                <td>{v.seats}</td>
                <td>{v.fuelType}</td>
                <td>
                  <span className={`badge ${v.isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
                    {v.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(v)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(v._id)}
                      disabled={deletingId === v._id}
                    >
                      {deletingId === v._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VehicleFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={selectedVehicle}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default AdminVehicles;
