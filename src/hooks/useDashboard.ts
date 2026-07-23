import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { apiRequest } from '@/config/api';
import { useToast } from '@/context/ToastContext';

export interface DashboardStats {
  agendamentosHoje: any[];
  faturamentoHoje: number;
  totalClientes: number;
  taxaComparecimento: number;
  faturamentoSemanal: { date: string; amount: number }[];
}

export const useDashboard = () => {
  const { tenant } = useTenant();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  const fetchStats = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const tenantId = (tenant as any)._id || tenant.id;
      const response = await apiRequest<DashboardStats>('/dashboard', {
        method: 'GET'
      }, tenantId);
      setStats(response);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar estatísticas do dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, addToast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refresh: fetchStats,
  };
};
