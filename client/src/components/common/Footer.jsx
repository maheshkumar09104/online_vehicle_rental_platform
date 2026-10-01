import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--footer-bg)',
      color: 'var(--footer-text)',
      padding: 'var(--space-2xl) 0 var(--space-lg)',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-sm)' }}>
              <span style={{ fontSize: '22px' }}>🚗</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>
                Auto<span style={{ color: 'var(--primary-green)' }}>Rent</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
              A modern, trusted vehicle rental platform connecting you with high-quality cars, bikes, SUVs, and vans for any destination.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', marginBottom: 'var(--space-md)' }}>Vehicle Types</h4>
            <ul style={{ listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Electric & Luxury Sedans</li>
              <li>Family & Adventure SUVs</li>
              <li>Superbikes & Cruisers</li>
              <li>Commercial & Group Vans</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '14px', marginBottom: 'var(--space-md)' }}>Customer Support</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
              24/7 Roadside Assistance<br />
              Email: support@autorent.com<br />
              Phone: +1 800-555-0199
            </p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #222222',
          paddingTop: 'var(--space-md)',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          © {new Date().getFullYear()} AutoRent Platform. Built with MERN Stack. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
