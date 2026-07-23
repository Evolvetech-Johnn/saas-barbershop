import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  children,
  disabled,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-accent text-background hover:bg-accent-hover focus-visible:ring-ring',
    secondary: 'bg-surface-2 text-text-primary hover:bg-surface-raised focus-visible:ring-ring border border-border-subtle',
    outline: 'border border-border-strong text-text-primary hover:bg-surface-2 focus-visible:ring-ring',
    ghost: 'text-text-secondary hover:bg-surface-2 hover:text-text-primary focus-visible:ring-ring',
    success: 'bg-status-success text-white hover:opacity-90 focus-visible:ring-status-success',
    danger: 'bg-status-danger text-white hover:opacity-90 focus-visible:ring-status-danger',
  };
  
  const sizeClasses = {
    sm: 'min-h-[36px] px-3 py-1.5 text-sm rounded-sm',
    md: 'min-h-[44px] px-4 py-2 text-sm rounded-md',
    lg: 'min-h-[48px] px-6 py-3 text-base rounded-lg',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}
      {children as React.ReactNode}
    </motion.button>
  );
});

Button.displayName = 'Button';
