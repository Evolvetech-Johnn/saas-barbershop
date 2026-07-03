import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { SaaSRevenueTrend } from '@/data/mockSaaS';

interface ReceitaSaaSChartProps {
  data: SaaSRevenueTrend[];
}

export const ReceitaSaaSChart: React.FC<ReceitaSaaSChartProps> = ({ data }) => {
  return (
    <div className="bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-base-100">Faturamento Recorrente Mensal (MRR)</h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="mrrColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--tenant-accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--tenant-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-base-800" />
            <XAxis 
              dataKey="month" 
              className="text-xs text-support-300"
              tickLine={false}
            />
            <YAxis 
              className="text-xs text-support-300"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(210, 10%, 10%)',
                borderRadius: '8px',
                border: '1px solid hsl(210, 10%, 20%)',
              }}
              labelStyle={{ color: 'white', fontWeight: 'bold' }}
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value),
                'MRR'
              ]}
            />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke="var(--tenant-accent)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#mrrColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
