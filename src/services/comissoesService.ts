import { Comissao, ComissaoResumo } from '@/types/comissao';
import { mockData } from '@/data/mockData';

export const comissoesService = {
  getComissoesByTenant: (tenantId: string): Comissao[] => {
    return mockData.comissoes.filter((c) => c.tenantId === tenantId);
  },

  getComissoesByProfissional: (tenantId: string, profissionalId: string): Comissao[] => {
    return mockData.comissoes.filter((c) => c.tenantId === tenantId && c.profissionalId === profissionalId);
  },

  getResumoComissoes: (tenantId: string, dataInicio: Date, dataFim: Date): ComissaoResumo[] => {
    const comissoesPeriodo = mockData.comissoes.filter((c) => 
      c.tenantId === tenantId && 
      c.dataHora >= dataInicio && 
      c.dataHora <= dataFim
    );

    const comissoesPorProfissional = comissoesPeriodo.reduce((acc, comissao) => {
      const profissional = mockData.profissionais.find(p => p.id === comissao.profissionalId);
      if (!profissional) return acc;

      if (!acc[comissao.profissionalId]) {
        acc[comissao.profissionalId] = {
          profissionalId: comissao.profissionalId,
          profissionalNome: profissional.nome,
          totalComissao: 0,
          totalVendas: 0,
          quantidadeAtendimentos: 0
        };
      }

      const comanda = mockData.comandas.find(c => c.id === comissao.comandaId);
      if (comanda) {
        acc[comissao.profissionalId].totalVendas += comanda.total;
      }

      acc[comissao.profissionalId].totalComissao += comissao.valor;
      acc[comissao.profissionalId].quantidadeAtendimentos += 1;

      return acc;
    }, {} as Record<string, ComissaoResumo>);

    return Object.values(comissoesPorProfissional);
  },

  createComissao: (
    tenantId: string,
    data: Omit<Comissao, 'id' | 'tenantId' | 'dataHora'>
  ): Comissao => {
    const novaComissao: Comissao = {
      id: `comissao${Date.now()}`,
      tenantId,
      dataHora: new Date(),
      ...data,
    };
    mockData.comissoes.push(novaComissao);
    return novaComissao;
  },

  deleteComissao: (tenantId: string, comissaoId: string): boolean => {
    const index = mockData.comissoes.findIndex(
      (c) => c.tenantId === tenantId && c.id === comissaoId
    );
    if (index === -1) return false;

    mockData.comissoes.splice(index, 1);
    return true;
  },
};
