import React from 'react';

const StatCard = ({ title, value, icon, subtitle }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--primary-green-light)',
        color: 'var(--primary-green-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
          {title}
        </span>
        <h3 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
          {value}
        </h3>
        {subtitle && (
          <span style={{ fontSize: '12px', color: 'var(--primary-green)', fontWeight: '500' }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
