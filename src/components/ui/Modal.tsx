import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-base-900 border border-base-800 rounded-lg shadow-xl">
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-base-800">
            <h3 className="text-lg font-semibold font-serif">{title}</h3>
            <button
              onClick={onClose}
              className="text-support-300 hover:text-support-100 transition-colors"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
