import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';

const VehicleFormModal = ({ isOpen, onClose, vehicle, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    type: 'car',
    pricePerDay: '',
    seats: 5,
    fuelType: 'Petrol',
    imageUrl: '',
    isAvailable: true,
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        brand: vehicle.brand || '',
        type: vehicle.type || 'car',
        pricePerDay: vehicle.pricePerDay || '',
        seats: vehicle.seats || 5,
        fuelType: vehicle.fuelType || 'Petrol',
        imageUrl: vehicle.imageUrl || '',
        isAvailable: vehicle.isAvailable !== undefined ? vehicle.isAvailable : true,
        description: vehicle.description || '',
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        type: 'car',
        pricePerDay: '',
        seats: 5,
        fuelType: 'Petrol',
        imageUrl: '',
        isAvailable: true,
        description: '',
      });
    }
    setError('');
  }, [vehicle, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (vehicle?._id) {
        // Update vehicle
        await api.put(`/vehicles/${vehicle._id}`, formData);
        onSuccess('Vehicle updated successfully!');
      } else {
        // Create vehicle
        await api.post('/vehicles', formData);
        onSuccess('Vehicle created successfully!');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving vehicle details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}
      maxWidth="680px"
    >
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

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Vehicle Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Model 3, Civic, Iron 883"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Brand / Manufacturer</label>
            <input
              type="text"
              name="brand"
              placeholder="e.g. Tesla, Honda, Harley-Davidson"
              className="form-input"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <select
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price per Day (₹)</label>
            <input
              type="number"
              name="pricePerDay"
              placeholder="e.g. 2500"
              min="1"
              className="form-input"
              value={formData.pricePerDay}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Total Seats</label>
            <input
              type="number"
              name="seats"
              placeholder="e.g. 5"
              min="1"
              max="60"
              className="form-input"
              value={formData.seats}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Fuel Type</label>
            <select
              name="fuelType"
              className="form-select"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Availability Status</label>
            <div style={{ display: 'flex', alignItems: 'center', height: '42px', gap: '10px' }}>
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary-green)' }}
              />
              <label htmlFor="isAvailable" style={{ fontSize: '14px', cursor: 'pointer' }}>
                Vehicle is available for rental
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://images.unsplash.com/..."
            className="form-input"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description (Optional)</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Brief description of vehicle specifications, features, or highlights..."
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
          <button type="button" className="btn btn-outline" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Create Vehicle'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default VehicleFormModal;
