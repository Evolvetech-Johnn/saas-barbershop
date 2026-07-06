import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-950 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[var(--tenant-accent)] text-base-950 hover:brightness-110 focus:ring-[var(--tenant-accent)]',
    secondary: 'bg-base-800 text-support-100 hover:bg-base-700 focus:ring-support-200',
    outline: 'border-2 border-[var(--tenant-accent)] text-[var(--tenant-accent)] hover:bg-[var(--tenant-accent)] hover:text-base-950 focus:ring-[var(--tenant-accent)]',
    ghost: 'text-support-100 hover:bg-base-800 focus:ring-support-200',
    success: 'bg-green-600 text-white hover:brightness-110 focus:ring-green-600',
    danger: 'bg-red-600 text-white hover:brightness-110 focus:ring-red-600',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded',
    md: 'px-4 py-2 rounded-md',
    lg: 'px-6 py-3 rounded-lg text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
};
