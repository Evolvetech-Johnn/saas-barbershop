import { Comanda, FormaPagamento, ItemComanda } from '@/types/comanda';
import { apiRequest } from '@/config/api';
import { Agendamento } from '@/types/agendamento';

export const comandaService = {
  getAll: async (tenantId: string): Promise<Comanda[]> => {
    return apiRequest<Comanda[]>('/comandas', {
      method: 'GET',
    }, tenantId);
  },

  getById: async (tenantId: string, id: string): Promise<Comanda> => {
    return apiRequest<Comanda>(`/comandas/${id}`, {
      method: 'GET',
    }, tenantId);
  },

  create: async (tenantId: string, data: Partial<Comanda>): Promise<Comanda> => {
    return apiRequest<Comanda>('/comandas', {
      method: 'POST',
      body: JSON.stringify(data),
    }, tenantId);
  },

  update: async (tenantId: string, id: string, data: Partial<Comanda>): Promise<Comanda> => {
    return apiRequest<Comanda>(`/comandas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, tenantId);
  },

  delete: async (tenantId: string, id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/comandas/${id}`, {
      method: 'DELETE',
    }, tenantId);
  },

  createFromAgendamento: async (
    tenantId: string,
    agendamento: Agendamento,
    formaPagamento: FormaPagamento = 'dinheiro',
  ): Promise<Comanda> => {
    // A comanda is constructed and sent to the backend
    const servico = agendamento.servicoId; // assuming it is populated
    const servicoId = (servico as any)._id || servico.id || servico;

    const item: ItemComanda = {
      tipo: 'servico',
      itemId: servicoId,
      nome: servico?.nome ?? 'Serviço',
      quantidade: 1,
      precoUnitario: servico?.preco ?? 0,
    };

    const total = item.precoUnitario * item.quantidade;

    const novaComandaData: Partial<Comanda> = {
      agendamentoId: (agendamento as any)._id || agendamento.id,
      clienteId: (agendamento.clienteId as any)?._id || agendamento.clienteId?.id || agendamento.clienteId,
      profissionalId: (agendamento.profissionalId as any)?._id || agendamento.profissionalId?.id || agendamento.profissionalId,
      itens: [item],
      formaPagamento,
      desconto: 0,
      total,
      dataHora: new Date(),
    };

    return comandaService.create(tenantId, novaComandaData);
  }
};
