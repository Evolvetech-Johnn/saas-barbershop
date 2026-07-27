import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { apiRequest } from '@/config/api';
import { useToast } from '@/context/ToastContext';
import { 
  KpiMetric, 
  MonthlyRevenue, 
  MonthlyTrend, 
  ServiceBreakdown, 
  ProfessionalCommission, 
  StockAlertItem 
} from '@/types/report';

export interface RelatoriosData {
  kpiMetrics: KpiMetric[];
  revenue: MonthlyRevenue[];
  monthlyTrend: MonthlyTrend[];
  serviceRevenue: ServiceBreakdown[];
  commissions: ProfessionalCommission[];
  stockAlerts: StockAlertItem[];
}

export const useRelatorios = () => {
  const { tenant } = useTenant();
  const [data, setData] = useState<RelatoriosData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  const fetchRelatorios = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const tenantId = (tenant as any)._id || tenant.id;
      const response = await apiRequest<RelatoriosData>('/relatorios', {
        method: 'GET'
      }, tenantId);
      setData(response);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar dados do relatório', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    fetchRelatorios();
  }, [fetchRelatorios]);

  return {
    data,
    loading,
    refresh: fetchRelatorios,
  };
};
