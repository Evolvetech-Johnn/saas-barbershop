import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Comissao, ComissaoResumo } from '@/types/comissao';
import { comissoesService } from '@/services/comissoesService';

export const useComissoes = () => {
  const { tenant } = useTenant();
  const [comissoes, setComissoes] = useState<Comissao[]>([]);
  const [resumo, setResumo] = useState<ComissaoResumo[]>([]);
  const [loading, setLoading] = useState(true);

  const dataInicio = new Date();
  dataInicio.setDate(1);
  dataInicio.setHours(0, 0, 0, 0);
  const dataFim = new Date();
  dataFim.setHours(23, 59, 59, 999);

  const [periodo, setPeriodo] = useState({
    inicio: dataInicio,
    fim: dataFim,
  });

  const carregarComissoes = () => {
    if (!tenant) return;
    setLoading(true);
    const dadosComissoes = comissoesService.getComissoesByTenant(tenant.id);
    const dadosResumo = comissoesService.getResumoComissoes(tenant.id, periodo.inicio, periodo.fim);
    setComissoes(dadosComissoes);
    setResumo(dadosResumo);
    setLoading(false);
  };

  useEffect(() => {
    carregarComissoes();
  }, [tenant, periodo]);

  return {
    comissoes,
    resumo,
    loading,
    periodo,
    setPeriodo,
    carregarComissoes,
  };
};
