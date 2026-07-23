import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { ProximosAgendamentos } from '@/components/dashboard/ProximosAgendamentos';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/utils/formatters';
import { PageHeader } from '@/components/ui/PageHeader';
import { Stat } from '@/components/ui/Stat';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users, Calendar, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { tenant } = useTenant();
  const { stats, loading } = useDashboard();

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <PageHeader title="Visão Geral" description="Carregando seus indicadores..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[104px] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
          <Skeleton className="lg:col-span-1 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  const { agendamentosHoje, faturamentoHoje, totalClientes, taxaComparecimento, faturamentoSemanal } = stats;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-2 border border-border-strong p-3 rounded-lg shadow-xl">
          <p className="text-text-secondary text-sm mb-1">{new Date(label).toLocaleDateString('pt-BR')}</p>
          <p className="font-bold text-accent">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Olá, ${tenant?.nome ?? 'Barbearia'}!`} 
        description="Aqui está o resumo da sua operação hoje." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Agendamentos Hoje"
          value={agendamentosHoje.length}
          trend={12} // Mock trend for visualization
          icon={<Calendar className="w-5 h-5" />}
        />
        <Stat
          label="Faturamento Hoje"
          value={formatCurrency(faturamentoHoje)}
          trend={-5} // Mock trend
          icon={<DollarSign className="w-5 h-5" />}
        />
        <Stat
          label="Total de Clientes"
          value={totalClientes}
          trend={8} // Mock trend
          icon={<Users className="w-5 h-5" />}
        />
        <Stat
          label="Taxa de Comparecimento"
          value={`${taxaComparecimento}%`}
          trend={2} // Mock trend
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-1 border border-border-subtle rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-semibold text-text-primary">Evolução do Faturamento</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={faturamentoSemanal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { weekday: 'short' })} 
                    stroke="var(--text-muted)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(val) => `R$ ${val}`} 
                    stroke="var(--text-muted)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--accent)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorFaturamento)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <ProximosAgendamentos agendamentosHoje={agendamentosHoje} />
        </div>
      </div>
    </div>
  );
};
