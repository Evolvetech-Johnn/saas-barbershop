import React from 'react';
import { Card } from '@/components/ui/Card';

export interface KpiCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}

/**
 * KpiCard – displays a single key performance indicator with a gradient background.
 * Design follows the project's premium aesthetic: glass‑morphism, subtle shadow, and
 * a dynamic accent color pulled from the tenant CSS variable.
 */
export const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon }) => {
  return (
    <Card className="bg-base-800/70 backdrop-blur-sm border border-base-700 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center space-x-3">
        {icon && <span className="text-2xl text-base-300">{icon}</span>}
        <div>
          <p className="text-sm text-base-300 uppercase mb-1">{label}</p>
          <p className="text-2xl font-bold text-base-100">{value}</p>
        </div>
      </div>
    </Card>
  );
};
