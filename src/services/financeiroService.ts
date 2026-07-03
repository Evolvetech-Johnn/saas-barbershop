import { Comanda, FormaPagamento } from '@/types/comanda';
import { mockData } from '@/data/mockData';

export const financeiroService = {
  getComandasByTenant: (tenantId: string): Comanda[] => {
    return mockData.comandas.filter((c) => c.tenantId === tenantId);
  },

  getComandaById: (tenantId: string, comandaId: string): Comanda | undefined => {
    return mockData.comandas.find((c) => c.tenantId === tenantId && c.id === comandaId);
  },

  createComanda: (
    tenantId: string,
    data: Omit<Comanda, 'id' | 'tenantId' | 'dataHora'>
  ): Comanda => {
    const novaComanda: Comanda = {
      id: `com${Date.now()}`,
      tenantId,
      dataHora: new Date(),
      ...data,
    };
    mockData.comandas.push(novaComanda);
    return novaComanda;
  },

  updateComanda: (
    tenantId: string,
    comandaId: string,
    data: Partial<Omit<Comanda, 'id' | 'tenantId'>>
  ): Comanda | undefined => {
    const index = mockData.comandas.findIndex(
      (c) => c.tenantId === tenantId && c.id === comandaId
    );
    if (index === -1) return undefined;

    mockData.comandas[index] = {
      ...mockData.comandas[index],
      ...data,
    };
    return mockData.comandas[index];
  },

  deleteComanda: (tenantId: string, comandaId: string): boolean => {
    const index = mockData.comandas.findIndex(
      (c) => c.tenantId === tenantId && c.id === comandaId
    );
    if (index === -1) return false;

    mockData.comandas.splice(index, 1);
    return true;
  },

  getTotaisByPeriodo: (tenantId: string, dataInicio: Date, dataFim: Date) => {
    const comandas = mockData.comandas.filter((c) => {
      return (
        c.tenantId === tenantId &&
        c.dataHora >= dataInicio &&
        c.dataHora <= dataFim
      );
    });

    const total = comandas.reduce((sum, c) => sum + c.total, 0);
    const recebido = total;
    const areceber = 0;

    const formasPagamento: Record<FormaPagamento, number> = {
      dinheiro: 0,
      pix: 0,
      cartao_credito: 0,
      cartao_debito: 0,
    };

    comandas.forEach((c) => {
      formasPagamento[c.formaPagamento] += c.total;
    });

    return {
      total,
      recebido,
      areceber,
      formasPagamento,
      comandas,
    };
  },
};
