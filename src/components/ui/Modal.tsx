import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Focus trap: move focus to modal when opened
  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      const previouslyFocused = document.activeElement as HTMLElement;
      modalRef.current.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
        if (e.key === 'Tab') {
          const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        previouslyFocused?.focus();
      };
    }
  }, [isOpen, onClose]);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      ref={modalRef}
    >
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-full sm:max-w-xl md:max-w-2xl bg-base-900 border border-base-800 rounded-lg shadow-xl mx-2">
        {title && (
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-base-800">
            <h3 id="modal-title" className="text-base sm:text-lg font-semibold font-serif">{title}</h3>
            <button
              onClick={onClose}
              className="text-support-300 hover:text-support-100 transition-colors p-2 rounded-md"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-3 sm:p-4 max-h-[80vh] overflow-auto">{children}</div>
      </div>
    </div>
  );
};
