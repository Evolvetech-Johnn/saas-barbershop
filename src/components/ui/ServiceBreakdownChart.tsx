import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ServiceBreakdown } from '@/types/report';

interface ServiceBreakdownChartProps {
  data: ServiceBreakdown[];
}

/**
 * ServiceBreakdownChart – visualiza a distribuição de receita por serviço.
 * Design inspirado no sistema de cores HSL usado nos demais charts para manter
 * a identidade visual premium e responsiva.
 */
export const ServiceBreakdownChart: React.FC<ServiceBreakdownChartProps> = ({
  data,
}) => {
  const colors = [
    'hsl(210, 70%, 50%)',
    'hsl(160, 70%, 45%)',
    'hsl(30, 70%, 55%)',
    'hsl(350, 65%, 55%)',
    'hsl(260, 60%, 55%)',
  ];

  return (
    <div className="bg-base-900 rounded-xl p-4 shadow-lg backdrop-blur-sm">
      <h2 className="text-lg font-medium text-base-100 mb-4">
        Distribuição por Serviço
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="revenue"
            nameKey="service"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={3}
            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(210, 10%, 10%)',
              borderRadius: '8px',
            }}
            formatter={(value: number) =>
              new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value)
            }
          />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{ fontSize: '0.85rem' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
