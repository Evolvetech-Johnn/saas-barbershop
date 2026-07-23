import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatProps {
  label: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
}

export const Stat: React.FC<StatProps> = ({ label, value, trend, icon }) => {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-surface-1 border border-border-subtle rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        {icon && <div className="text-text-muted">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold font-serif text-text-primary tracking-tight">{value}</span>
        {trend !== undefined && (
          <span className={`text-xs font-medium flex items-center gap-1 ${
            trend > 0 ? 'text-status-success' : trend < 0 ? 'text-status-danger' : 'text-text-muted'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </motion.div>
  );
};
