// Types for reporting data
export interface MonthlyRevenue {
  month: string; // e.g., '2025-01'
  amount: number;
}

export interface ServiceRevenue {
  serviceName: string;
  amount: number;
}

export interface ProfessionalCommission {
  professionalId: string;
  name: string;
  commission: number;
}

export interface StockAlertItem {
  productId: string;
  name: string;
  quantity: number;
  minQuantity: number;
}
export interface ServiceBreakdown {
  service: string;
  revenue: number;
}
// New interfaces for Phase 13
export interface KpiMetric {
  label: string;
  value: number | string;
  icon?: string; // optional icon name
}
export interface MonthlyTrend {
  month: string;
  value: number;
}
