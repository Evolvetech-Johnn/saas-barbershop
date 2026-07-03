import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTrend } from '@/types/report';

interface TrendLineChartProps {
  data: MonthlyTrend[];
}

/**
 * TrendLineChart – shows a line chart of a metric over months.
 * Uses the project's premium styling: subtle grid, accent-colored line,
 * and a smooth tooltip with currency formatting when appropriate.
 */
export const TrendLineChart: React.FC<TrendLineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-base-800" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis />
        <Tooltip
          formatter={(value: number) =>
            new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(value)
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--tenant-accent)"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
