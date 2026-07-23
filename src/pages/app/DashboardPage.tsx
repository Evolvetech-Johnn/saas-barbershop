import React from 'react'
import { useTenant } from '@/context/TenantContext'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { ProximosAgendamentos } from '@/components/dashboard/ProximosAgendamentos'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency } from '@/utils/formatters'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const DashboardPage: React.FC = () => {
  const { tenant } = useTenant()
  const { stats, loading } = useDashboard()

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tenant-accent)]"></div>
      </div>
    )
  }

  const { agendamentosHoje, faturamentoHoje, totalClientes, taxaComparecimento, faturamentoSemanal } = stats;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-900 border border-base-800 p-3 rounded-lg shadow-xl">
          <p className="text-support-200 mb-1">{new Date(label).toLocaleDateString('pt-BR')}</p>
          <p className="font-bold text-[var(--tenant-accent)]">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-2">
          Olá, {tenant?.nome ?? 'Barbearia'}!
        </h1>
        <p className="text-support-300">Aqui está o resumo do seu dia</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Agendamentos Hoje"
          value={agendamentosHoje.length.toString()}
          change="Atualizado agora"
          icon="📅"
        />
        <KpiCard
          title="Faturamento Hoje"
          value={formatCurrency(faturamentoHoje)}
          change="Atualizado agora"
          icon="💰"
        />
        <KpiCard
          title="Total de Clientes"
          value={totalClientes.toString()}
          change="Atualizado agora"
          icon="👥"
        />
        <KpiCard
          title="Taxa de Comparecimento"
          value={`${taxaComparecimento}%`}
          change="Baseado nos agendamentos de hoje"
          icon="✅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-base-900 border border-base-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Faturamento Semanal</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={faturamentoSemanal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--tenant-accent)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--tenant-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('pt-BR', { weekday: 'short' })} 
                    stroke="var(--color-support-400)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(val) => `R$ ${val}`} 
                    stroke="var(--color-support-400)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-800)" vertical={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--tenant-accent)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorFaturamento)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <ProximosAgendamentos agendamentosHoje={agendamentosHoje} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-base-900/50 backdrop-blur-md border border-base-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-support-100 flex items-center gap-2">
              <span className="text-xl">🎂</span> Aniversariantes do Mês
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-base-800/50 rounded-lg border border-base-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary/80 to-brand-primary flex items-center justify-center font-bold text-white shadow-lg">
                  JS
                </div>
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-xs text-support-300">12/07 - Faz 32 anos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-800/50 rounded-lg border border-base-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary/80 to-brand-primary flex items-center justify-center font-bold text-white shadow-lg">
                  MS
                </div>
                <div>
                  <p className="font-medium">Maria Santos</p>
                  <p className="text-xs text-support-300">18/07 - Faz 28 anos</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-base-800/50 rounded-lg border border-base-700/50 opacity-70">
                <div className="w-10 h-10 rounded-full bg-base-700 flex items-center justify-center font-bold text-support-200">
                  PC
                </div>
                <div>
                  <p className="font-medium">Pedro Costa</p>
                  <p className="text-xs text-support-400">25/07 - Faz 45 anos</p>
                </div>
              </div>
              <button className="w-full mt-2 py-2 text-sm text-[var(--tenant-accent)] hover:text-white transition-colors font-medium">
                Ver todos os aniversariantes →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
