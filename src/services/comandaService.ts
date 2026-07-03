import { Comanda, FormaPagamento, ItemComanda } from '@/types/comanda';
import { Agendamento } from '@/types/agendamento';
import { mockData } from '@/data/mockData';
import { comissoesService } from '@/services/comissoesService';
import { agendamentoService } from '@/services/agendamentoService';

export const comandaService = {
  /** Return all comandas for a tenant */
  getComandasByTenant: (tenantId: string): Comanda[] => {
    return mockData.comandas.filter((c) => c.tenantId === tenantId);
  },

  /** Create a comanda from a finished agendamento */
  createComandaFromAgendamento: (
    tenantId: string,
    agendamento: Agendamento,
    formaPagamento: FormaPagamento = 'dinheiro',
  ): Comanda => {
    // Build the item for the service scheduled
    const servico = mockData.servicos.find((s) => s.id === agendamento.servicoId);
    const item: ItemComanda = {
      tipo: 'servico',
      itemId: servico?.id ?? '',
      nome: servico?.nome ?? 'Serviço',
      quantidade: 1,
      precoUnitario: servico?.preco ?? 0,
    };

    const total = item.precoUnitario * item.quantidade;

    const novaComanda: Comanda = {
      id: `com${Date.now()}`,
      tenantId,
      agendamentoId: agendamento.id,
      clienteId: agendamento.clienteId,
      profissionalId: agendamento.profissionalId,
      itens: [item],
      formaPagamento,
      total,
      dataHora: new Date(),
    };

    // Persist the new comanda
    mockData.comandas.push(novaComanda);

    // Generate commission (10% of total)
    const valorComissao = total * 0.1;
    comissoesService.createComissao(tenantId, {
      profissionalId: agendamento.profissionalId,
      comandaId: novaComanda.id,
      valor: valorComissao,
    });

    // Update agendamento status to concluido
    agendamentoService.atualizarAgendamento(agendamento.id, { status: 'concluido' });

    return novaComanda;
  },

  /** Update a comanda */
  updateComanda: (
    tenantId: string,
    comandaId: string,
    data: Partial<Omit<Comanda, 'id' | 'tenantId'>>,
  ): Comanda | undefined => {
    const idx = mockData.comandas.findIndex(
      (c) => c.tenantId === tenantId && c.id === comandaId,
    );
    if (idx === -1) return undefined;
    mockData.comandas[idx] = { ...mockData.comandas[idx], ...data };
    return mockData.comandas[idx];
  },

  /** Delete a comanda */
  deleteComanda: (tenantId: string, comandaId: string): boolean => {
    const idx = mockData.comandas.findIndex(
      (c) => c.tenantId === tenantId && c.id === comandaId,
    );
    if (idx === -1) return false;
    mockData.comandas.splice(idx, 1);
    return true;
  },
};
