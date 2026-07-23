import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeConfig = {
    success: {
      classes: 'bg-status-success/10 border-status-success/20 text-status-success',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    error: {
      classes: 'bg-status-danger/10 border-status-danger/20 text-status-danger',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    warning: {
      classes: 'bg-status-warning/10 border-status-warning/20 text-status-warning',
      icon: <AlertTriangle className="w-5 h-5" />,
    },
    info: {
      classes: 'bg-surface-2 border-border-strong text-text-primary',
      icon: <Info className="w-5 h-5" />,
    },
  };

  const { classes, icon } = typeConfig[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      role="status"
      aria-live="polite"
      className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] border backdrop-blur-md ${classes}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="ml-4 p-1 rounded-md opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
