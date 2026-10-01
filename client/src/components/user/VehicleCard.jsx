import React from 'react';

const VehicleCard = ({ vehicle, onSelectBooking }) => {
  const {
    name,
    brand,
    type,
    pricePerDay,
    seats,
    fuelType,
    imageUrl,
    isAvailable,
    description,
  } = vehicle;

  return (
    <div className="card" style={{
      padding: 0,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    }}>
      {/* Vehicle Image Container */}
      <div style={{ position: 'relative', height: '190px', width: '100%', backgroundColor: '#E5E7EB' }}>
        <img
          src={imageUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80';
          }}
        />
        {/* Availability Badge */}
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <span className={`badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
            {isAvailable ? '● Available' : '● Unavailable'}
          </span>
        </div>
        {/* Type Badge */}
        <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
          <span className="badge badge-type">
            {type}
          </span>
        </div>
      </div>

      {/* Vehicle Content */}
      <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
            {brand}
          </span>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {name}
          </h4>
        </div>

        {description && (
          <p style={{
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {description}
          </p>
        )}

        {/* Specs row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
        }}>
          <span>👥 {seats} {seats > 1 ? 'Seats' : 'Seat'}</span>
          <span>⛽ {fuelType}</span>
        </div>

        {/* Pricing and Action */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '12px',
        }}>
          <div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary-green)' }}>
              ₹{pricePerDay}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}> /day</span>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => onSelectBooking(vehicle)}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
