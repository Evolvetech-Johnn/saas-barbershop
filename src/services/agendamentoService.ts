import { Agendamento } from '@/types/agendamento';
import { FormaPagamento } from '@/types/comanda';
import { comandaService } from '@/services/comandaService';
import { mockData } from '@/data/mockData';
import { Profissional } from '@/types/profissional';

const STORAGE_KEY = 'barbearia_agendamentos';

interface DisponibilidadeResultado {
  disponivel: boolean;
  mensagem: string;
  agendamentoConflitante?: Agendamento;
}

const construirDataHora = (data: string | Date, horario?: string): Date => {
  if (data instanceof Date) {
    const dataHora = new Date(data);
    if (!horario) return dataHora;

    const [horas, minutos] = horario.split(':').map(Number);
    dataHora.setHours(horas, minutos, 0, 0);
    return dataHora;
  }

  if (!horario) {
    const [ano, mes, dia] = data.split('-').map(Number);
    return new Date(ano, mes - 1, dia);
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const [horas, minutos] = horario.split(':').map(Number);
  return new Date(ano, mes - 1, dia, horas, minutos, 0, 0);
};

const isAgendamentoAtivo = (agendamento: Agendamento) => agendamento.status === 'confirmado';

export const verificarDisponibilidade = (
  tenantId: string,
  profissionalId: string,
  data: string | Date,
  horario?: string,
  duracaoMinutos = 30,
  agendamentoId?: string
): DisponibilidadeResultado => {
  // Regra centralizada de disponibilidade: bloqueia sobreposição de intervalos para o mesmo profissional.
  const dataHora = construirDataHora(data, horario);
  const dataHoraFim = new Date(dataHora.getTime() + duracaoMinutos * 60000);

  const agendamentos = agendamentoService.getAgendamentos().filter((agendamento) => {
    return (
      agendamento.tenantId === tenantId &&
      agendamento.profissionalId === profissionalId &&
      isAgendamentoAtivo(agendamento)
    );
  });

  const agendamentoConflitante = agendamentos.find((agendamento) => {
    if (agendamentoId && agendamento.id === agendamentoId) return false;

    const inicioExistente = agendamento.dataHora;
    const duracaoExistente = agendamento.duracaoMinutos ?? duracaoMinutos;
    const fimExistente = new Date(inicioExistente.getTime() + duracaoExistente * 60000);

    return dataHora < fimExistente && dataHoraFim > inicioExistente;
  });

  if (!agendamentoConflitante) {
    return {
      disponivel: true,
      mensagem: 'Horário disponível.'
    };
  }

  return {
    disponivel: false,
    mensagem: 'Este horário já está reservado para o profissional selecionado.',
    agendamentoConflitante
  };
};

export const obterProfissionaisDisponiveis = (
  tenantId: string,
  data: string | Date,
  horario: string,
  duracaoMinutos = 30,
  profissionalIds?: string[]
): Profissional[] => {
  // Filtra os demais profissionais do tenant que conseguem atender no mesmo horário.
  const profissionais = mockData.profissionais.filter((profissional) => {
    const pertenceAoTenant = profissional.tenantId === tenantId && profissional.ativo !== false;
    const estaNaLista = !profissionalIds || profissionalIds.includes(profissional.id);
    return pertenceAoTenant && estaNaLista;
  });

  return profissionais.filter((profissional) => {
    return verificarDisponibilidade(tenantId, profissional.id, data, horario, duracaoMinutos).disponivel;
  });
};

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

  createAgendamento: (agendamento: Omit<Agendamento, 'id'>): Agendamento | null => {
    const disponibilidade = verificarDisponibilidade(
      agendamento.tenantId,
      agendamento.profissionalId,
      agendamento.dataHora,
      undefined,
      agendamento.duracaoMinutos ?? 30
    );

    if (!disponibilidade.disponivel) return null;

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

    if (data.profissionalId || data.dataHora || data.duracaoMinutos) {
      const disponibilidade = verificarDisponibilidade(
        updatedAgendamento.tenantId,
        updatedAgendamento.profissionalId,
        updatedAgendamento.dataHora,
        undefined,
        updatedAgendamento.duracaoMinutos ?? 30,
        id
      );

      if (!disponibilidade.disponivel) return null;
    }

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
    const ag = agendamentoService.getAgendamentos().find(a => a.id === agendamentoId && a.tenantId === tenantId);
    if (!ag) return;
    comandaService.createComandaFromAgendamento(tenantId, ag, formaPagamento);
  },
};
