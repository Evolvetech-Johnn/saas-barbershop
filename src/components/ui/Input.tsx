import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-4 py-2 bg-base-800 border border-base-800 rounded-md text-support-100 placeholder-support-300 focus:outline-none focus:border-[var(--tenant-accent)] focus:ring-1 focus:ring-[var(--tenant-accent)] ${className}`}
      {...props}
    />
  );
};
