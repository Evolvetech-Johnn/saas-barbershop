import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-base-900 border border-base-800 rounded-lg shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
