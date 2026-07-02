import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select: React.FC<SelectProps> = ({ className = '', ...props }) => {
  return (
    <select
      className={`w-full px-4 py-2 bg-base-800 border border-base-800 rounded-md text-support-100 focus:outline-none focus:border-[var(--tenant-accent)] focus:ring-1 focus:ring-[var(--tenant-accent)] ${className}`}
      {...props}
    />
  );
};
