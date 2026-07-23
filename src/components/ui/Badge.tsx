import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'accent';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  variant = 'default',
  children,
  className = '',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-surface-2 text-text-secondary border border-border-subtle',
    success: 'bg-status-success/10 text-status-success border border-status-success/20',
    warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
    danger: 'bg-status-danger/10 text-status-danger border border-status-danger/20',
    accent: 'bg-accent/10 text-accent border border-accent/20',
  };

  return (
    <span
      ref={ref}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
