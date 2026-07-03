import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Comanda } from '@/types/comanda';
import { financeiroService } from '@/services/financeiroService';

export const useFinanceiro = () => {
  const { tenant } = useTenant();
  const [comandas, setComandas] = useState<Comanda[]>([]);
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

  const carregarComandas = () => {
    if (!tenant) return;
    setLoading(true);
    const dados = financeiroService.getComandasByTenant(tenant.id);
    setComandas(dados);
    setLoading(false);
  };

  useEffect(() => {
    carregarComandas();
  }, [tenant]);

  const totais = tenant
    ? financeiroService.getTotaisByPeriodo(tenant.id, periodo.inicio, periodo.fim)
    : { total: 0, recebido: 0, areceber: 0, formasPagamento: {} as any, comandas: [] };

  const criarComanda = (data: Omit<Comanda, 'id' | 'tenantId' | 'dataHora'>) => {
    if (!tenant) return;
    financeiroService.createComanda(tenant.id, data);
    carregarComandas();
  };

  const atualizarComanda = (
    comandaId: string,
    data: Partial<Omit<Comanda, 'id' | 'tenantId'>>
  ) => {
    if (!tenant) return;
    financeiroService.updateComanda(tenant.id, comandaId, data);
    carregarComandas();
  };

  const excluirComanda = (comandaId: string) => {
    if (!tenant) return;
    financeiroService.deleteComanda(tenant.id, comandaId);
    carregarComandas();
  };

  return {
    comandas,
    loading,
    totais,
    periodo,
    setPeriodo,
    criarComanda,
    atualizarComanda,
    excluirComanda,
  };
};
