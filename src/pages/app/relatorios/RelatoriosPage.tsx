import React from 'react';
import { RevenueChart } from '@/components/ui/RevenueChart';
import { ServiceBreakdownChart } from '@/components/ui/ServiceBreakdownChart';
import { CommissionTable } from '@/components/ui/CommissionTable';
import { StockAlert } from '@/components/ui/StockAlert';
import { KpiCard } from '@/components/ui/KpiCard';
import { TrendLineChart } from '@/components/ui/TrendLineChart';
import { useRelatorios } from '@/hooks/useRelatorios';
import { Skeleton } from '@/components/ui/Skeleton';

export const RelatoriosPage: React.FC = () => {
  const { data, loading } = useRelatorios();

  if (loading || !data) {
    return (
      <div className="p-4 space-y-8">
        <h1 className="text-2xl font-bold">Relatórios &amp; BI</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[104px] rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-1 h-[400px] rounded-xl" />
          <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Relatórios &amp; BI</h1>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {data.kpiMetrics.map((kpi, idx) => (
          <KpiCard key={idx} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      {/* Monthly Revenue and Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-100">Faturamento Mensal</h2>
          <RevenueChart data={data.revenue} />
        </section>

        <section className="bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-100">Tendência de Agendamentos</h2>
          <TrendLineChart data={data.monthlyTrend} />
        </section>
      </div>

      {/* Service Breakdown & Commissions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1">
          <ServiceBreakdownChart data={data.serviceRevenue} />
        </section>

        <section className="lg:col-span-2 bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-100">Comissões dos Profissionais (Mês Atual)</h2>
          <CommissionTable data={data.commissions} />
        </section>
      </div>

      {/* Stock Alerts Section */}
      <section className="bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-base-100">Alertas de Estoque</h2>
        <StockAlert data={data.stockAlerts} />
      </section>
    </div>
  );
};
