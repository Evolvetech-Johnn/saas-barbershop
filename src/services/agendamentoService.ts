import { Agendamento } from '@/types/agendamento';
import { FormaPagamento } from '@/types/comanda';
import { comandaService } from '@/services/comandaService';

const STORAGE_KEY = 'barbearia_agendamentos';

export const agendamentoService = {
  getAgendamentos: (): Agendamento[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((a: any) => ({
        ...a,
        dataHora: new Date(a.dataHora)
      }));
    } catch (e) {
      console.error('Error parsing agendamentos from localStorage', e);
      return [];
    }
  },

  getAgendamentosByTenant: (tenantId: string): Agendamento[] => {
    return agendamentoService.getAgendamentos().filter(a => a.tenantId === tenantId);
  },

  saveAgendamentos: (agendamentos: Agendamento[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));
  },

  createAgendamento: (agendamento: Omit<Agendamento, 'id'>): Agendamento => {
    const agendamentos = agendamentoService.getAgendamentos();
    const novoAgendamento: Agendamento = {
      ...agendamento,
      id: `ag_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    agendamentos.push(novoAgendamento);
    agendamentoService.saveAgendamentos(agendamentos);
    return novoAgendamento;
  },

  updateAgendamento: (id: string, data: Partial<Omit<Agendamento, 'id' | 'tenantId'>>): Agendamento | null => {
    const agendamentos = agendamentoService.getAgendamentos();
    const index = agendamentos.findIndex(a => a.id === id);
    if (index === -1) return null;

    const updatedAgendamento = { ...agendamentos[index], ...data };
    agendamentos[index] = updatedAgendamento;
    agendamentoService.saveAgendamentos(agendamentos);
    return updatedAgendamento;
  },

  deleteAgendamento: (id: string): boolean => {
    const agendamentos = agendamentoService.getAgendamentos();
    const filtered = agendamentos.filter(a => a.id !== id);
    if (filtered.length === agendamentos.length) return false;
    
    agendamentoService.saveAgendamentos(filtered);
    return true;
  },

  concluirAgendamento: (tenantId: string, agendamentoId: string, formaPagamento: FormaPagamento = 'dinheiro') => {
    // Find agendamento
    const ag = agendamentoService.getAgendamentos().find(a => a.id === agendamentoId && a.tenantId === tenantId);
    if (!ag) return;
    // Use comandaService to create comanda and commission
    comandaService.createComandaFromAgendamento(tenantId, ag, formaPagamento);
    // Refresh is handled by caller
  },
};
