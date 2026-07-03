import { useState, useEffect } from 'react';
import { FormaPagamento } from '@/types/comanda';
import { useTenant } from '@/context/TenantContext';
import { Agendamento } from '@/types/agendamento';
import { agendamentoService } from '@/services/agendamentoService';

export const useAgenda = () => {
  const { tenant } = useTenant();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarAgendamentos = () => {
    if (!tenant) return;
    setLoading(true);
    const dados = agendamentoService.getAgendamentosByTenant(tenant.id);
    setAgendamentos(dados);
    setLoading(false);
  };

  useEffect(() => {
    carregarAgendamentos();
  }, [tenant]);

  const criarAgendamento = (data: Omit<Agendamento, 'id'>) => {
    if (!tenant) return;
    agendamentoService.createAgendamento({
      ...data,
      tenantId: tenant.id
    });
    carregarAgendamentos();
  };

  const atualizarAgendamento = (id: string, data: Partial<Omit<Agendamento, 'id' | 'tenantId'>>) => {
    if (!tenant) return;
    agendamentoService.updateAgendamento(id, data);
    carregarAgendamentos();
  };

  const excluirAgendamento = (id: string) => {
    if (!tenant) return;
    agendamentoService.deleteAgendamento(id);
    carregarAgendamentos();
  };

  const concluirAgendamento = (agendamentoId: string, formaPagamento: FormaPagamento = 'dinheiro') => {
    if (!tenant) return;
    agendamentoService.concluirAgendamento(tenant.id, agendamentoId, formaPagamento);
    carregarAgendamentos();
  };

  return {
    agendamentos,
    loading,
    criarAgendamento,
    atualizarAgendamento,
    excluirAgendamento,
    concluirAgendamento,
    carregarAgendamentos,
  };
};
