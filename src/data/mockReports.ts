// Mock data for reporting
export const mockReports = {
  revenue: [
    { month: '2024-01', amount: 1200 },
    { month: '2024-02', amount: 1500 },
    { month: '2024-03', amount: 1100 },
    { month: '2024-04', amount: 1700 },
    { month: '2024-05', amount: 1600 },
  ] as import('@/types/report').MonthlyRevenue[],
  serviceRevenue: [
    { service: 'Corte de Cabelo', revenue: 3000 },
    { service: 'Barba', revenue: 1500 },
    { service: 'Corte + Barba', revenue: 2000 },
    { service: 'Spa do Barba', revenue: 800 },
  ] as import('@/types/report').ServiceBreakdown[],
  commissions: [
    { professionalId: 'p1', name: 'Carlos', commission: 500 },
    { professionalId: 'p2', name: 'Ana', commission: 300 },
    { professionalId: 'p3', name: 'Bruno', commission: 400 },
  ] as import('@/types/report').ProfessionalCommission[],
  stockAlerts: [
    { productId: 'prod2', name: 'Óleo de Barba', quantity: 3, minQuantity: 5 },
    { productId: 'prod3', name: 'Shampoo Premium', quantity: 2, minQuantity: 5 },
  ] as import('@/types/report').StockAlertItem[],
  // New KPI metrics for Phase 13
  kpiMetrics: [
    { label: 'Faturamento Total', value: 'R$ 9.300' },
    { label: 'Clientes Ativos', value: 124 },
    { label: 'Novas Reservas', value: 27 },
    { label: 'Taxa de Ocupação', value: '85%' },
  ] as import('@/types/report').KpiMetric[],
  // Monthly trend data for line chart
  monthlyTrend: [
    { month: '2024-01', value: 1200 },
    { month: '2024-02', value: 1500 },
    { month: '2024-03', value: 1100 },
    { month: '2024-04', value: 1700 },
    { month: '2024-05', value: 1600 },
    { month: '2024-06', value: 1800 },
  ] as import('@/types/report').MonthlyTrend[],
};
