import { useState, useEffect } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Comanda } from '@/types/comanda';
import { comandaService } from '@/services/comandaService';

export const useComandas = () => {
  const { tenant } = useTenant();
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const carregarComandas = () => {
    if (!tenant) return;
    setLoading(true);
    const dados = comandaService.getComandasByTenant(tenant.id);
    setComandas(dados);
    setLoading(false);
  };

  useEffect(() => {
    carregarComandas();
  }, [tenant]);

  const criarComanda = (data: Omit<Comanda, 'id' | 'tenantId' | 'dataHora'>) => {
    if (!tenant) return;
    // Use service to create a comanda from an agendamento; here we just delegate
    comandaService.createComandaFromAgendamento(tenant.id, data as any);
    carregarComandas();
  };

  const atualizarComanda = (
    comandaId: string,
    data: Partial<Omit<Comanda, 'id' | 'tenantId'>>
  ) => {
    if (!tenant) return;
    comandaService.updateComanda(tenant.id, comandaId, data);
    carregarComandas();
  };

  const excluirComanda = (comandaId: string) => {
    if (!tenant) return;
    comandaService.deleteComanda(tenant.id, comandaId);
    carregarComandas();
  };

  return {
    comandas,
    loading,
    carregarComandas,
    criarComanda,
    atualizarComanda,
    excluirComanda,
  };
};
