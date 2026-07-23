import { useState, useEffect, useCallback } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Agendamento } from '@/types/agendamento';
import { agendamentoService } from '@/services/agendamentoService';
import { FormaPagamento } from '@/types/comanda';
import { comandaService } from '@/services/comandaService';
import { useToast } from '@/context/ToastContext';

export const useAgenda = (startDate?: string, endDate?: string) => {
  const { tenant } = useTenant();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const carregarAgendamentos = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const dados = await agendamentoService.getAll(currentId, startDate, endDate);
      setAgendamentos(dados);
    } catch (error) {
      console.error(error);
      addToast('Erro ao carregar agendamentos', 'error');
    } finally {
      setLoading(false);
    }
  }, [tenant, startDate, endDate, addToast]);

  useEffect(() => {
    carregarAgendamentos();
  }, [carregarAgendamentos]);

  const criarAgendamento = async (data: Partial<Agendamento>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const novo = await agendamentoService.create(currentId, data);
      setAgendamentos(prev => [...prev, novo]);
      addToast('Agendamento criado com sucesso!', 'success');
      return true;
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Erro ao criar agendamento', 'error');
      return false;
    }
  };

  const atualizarAgendamento = async (id: string, data: Partial<Agendamento>) => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      const atualizado = await agendamentoService.update(currentId, id, data);
      setAgendamentos(prev => prev.map(a => (((a as any)._id || a.id) === ((atualizado as any)._id || atualizado.id) ? atualizado : a)));
      addToast('Agendamento atualizado com sucesso!', 'success');
      return true;
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Erro ao atualizar agendamento', 'error');
      return false;
    }
  };

  const excluirAgendamento = async (id: string) => {
    if (!tenant) return;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await agendamentoService.delete(currentId, id);
      setAgendamentos(prev => prev.filter(a => ((a as any)._id || a.id) !== id));
      addToast('Agendamento excluído com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Erro ao excluir agendamento', 'error');
    }
  };

  const concluirAgendamento = async (agendamento: Agendamento, formaPagamento: FormaPagamento = 'dinheiro') => {
    if (!tenant) return false;
    try {
      const currentId = (tenant as any)._id || tenant.id;
      await comandaService.createFromAgendamento(currentId, agendamento, formaPagamento);
      // Backend automatically updates the Agendamento status to 'concluido'
      setAgendamentos(prev => prev.map(a => (((a as any)._id || a.id) === ((agendamento as any)._id || agendamento.id) ? { ...a, status: 'concluido' } : a)));
      addToast('Agendamento concluído (Comanda gerada)!', 'success');
      return true;
    } catch (error: any) {
      console.error(error);
      addToast(error.message || 'Erro ao concluir agendamento', 'error');
      return false;
    }
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
