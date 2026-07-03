import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const typeClasses = {
    success: 'bg-green-900/90 text-green-100 border border-green-700',
    error: 'bg-red-900/90 text-red-100 border border-red-700',
    warning: 'bg-yellow-900/90 text-yellow-100 border border-yellow-700',
    info: 'bg-base-800 text-support-100 border border-base-700',
  };

  return (
    <div role="status" aria-live="polite" aria-label={type} className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] ${typeClasses[type]}`} >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-sm hover:opacity-70">
        ×
      </button>
    </div>
  );
};
