import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { PlanoFidelidade } from '@/types/planoFidelidade';
import { planosService } from '@/services/planosService';

export const usePlanos = () => {
  const { tenant } = useTenant();
  const [planos, setPlanos] = useState<PlanoFidelidade[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarPlanos = () => {
    if (!tenant) return;
    setLoading(true);
    const dadosPlanos = planosService.getPlanosByTenant(tenant.id);
    setPlanos(dadosPlanos);
    setLoading(false);
  };

  useEffect(() => {
    carregarPlanos();
  }, [tenant]);

  return {
    planos,
    loading,
    carregarPlanos,
  };
};
