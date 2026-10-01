import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const typeClass =
    type === 'error'
      ? 'toast-error'
      : type === 'info'
      ? 'toast-info'
      : 'toast-success';

  return (
    <div className={`toast ${typeClass}`}>
      <span>{type === 'error' ? '⚠️' : '✅'}</span>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFFFFF',
            marginLeft: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Toast;
