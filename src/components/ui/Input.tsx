import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ 
  className = '', 
  error, 
  disabled, 
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      disabled={disabled}
      className={`min-h-[44px] w-full px-4 py-2 bg-surface-1 border rounded-md text-text-primary placeholder-text-muted transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
        ${error 
          ? 'border-status-danger focus-visible:border-status-danger focus-visible:ring-status-danger/50' 
          : 'border-border-strong focus-visible:border-accent focus-visible:ring-ring'
        }
        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = 'Input';
