import React from 'react';

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({
  className = '',
  ...props
}) => {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${className}`} {...props} />
    </div>
  );
};

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  ...props
}) => {
  return <thead className={`bg-base-800 ${className}`} {...props} />;
};

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  ...props
}) => {
  return <tbody className={className} {...props} />;
};

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = '',
  ...props
}) => {
  return <tr className={`border-b border-base-800 hover:bg-base-800/50 ${className}`} {...props} />;
};

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  ...props
}) => {
  return <td className={`px-4 py-3 text-sm ${className}`} {...props} />;
};

export const TableHeader: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = '',
  ...props
}) => {
  return <th className={`px-4 py-3 text-left text-xs font-medium text-support-300 uppercase tracking-wider ${className}`} {...props} />;
};
