import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary mb-1">{title}</h1>
        {description && <p className="text-sm text-text-muted">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
