import React from 'react';
import { RevenueChart } from '@/components/ui/RevenueChart';
import { ServiceBreakdownChart } from '@/components/ui/ServiceBreakdownChart';
import { CommissionTable } from '@/components/ui/CommissionTable';
import { StockAlert } from '@/components/ui/StockAlert';
import { KpiCard } from '@/components/ui/KpiCard';
import { TrendLineChart } from '@/components/ui/TrendLineChart';
import { mockReports } from '@/data/mockReports';

export const RelatoriosPage: React.FC = () => {
  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold">Relatórios &amp; BI</h1>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {mockReports.kpiMetrics.map((kpi, idx) => (
          <KpiCard key={idx} label={kpi.label} value={kpi.value} />
        ))}
      </div>

      {/* Monthly Revenue and Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-100">Faturamento Mensal</h2>
          <RevenueChart data={mockReports.revenue} />
        </section>

        <section className="bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-100">Tendência de Vendas</h2>
          <TrendLineChart data={mockReports.monthlyTrend} />
        </section>
      </div>

      {/* Service Breakdown & Commissions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1">
          <ServiceBreakdownChart data={mockReports.serviceRevenue} />
        </section>

        <section className="lg:col-span-2 bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-base-100">Comissões dos Profissionais</h2>
          <CommissionTable data={mockReports.commissions} />
        </section>
      </div>

      {/* Stock Alerts Section */}
      <section className="bg-base-900 border border-base-800 rounded-xl p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-base-100">Alertas de Estoque</h2>
        <StockAlert data={mockReports.stockAlerts} />
      </section>
    </div>
  );
};
