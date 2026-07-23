import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ 
  className = '', 
  error, 
  disabled, 
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      disabled={disabled}
      className={`min-h-[44px] w-full px-4 py-2 bg-surface-1 border rounded-md text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed appearance-none
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

Select.displayName = 'Select';
