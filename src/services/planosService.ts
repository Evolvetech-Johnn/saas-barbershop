import { PlanoFidelidade } from '@/types/planoFidelidade';
import { mockData } from '@/data/mockData';

export const planosService = {
  getPlanosByTenant: (tenantId: string): PlanoFidelidade[] => {
    return mockData.planosFidelidade.filter((p) => p.tenantId === tenantId);
  },

  getPlanoById: (tenantId: string, planoId: string): PlanoFidelidade | undefined => {
    return mockData.planosFidelidade.find((p) => p.tenantId === tenantId && p.id === planoId);
  },

  createPlano: (tenantId: string, data: Omit<PlanoFidelidade, 'id' | 'tenantId'>): PlanoFidelidade => {
    const novoPlano: PlanoFidelidade = {
      id: `plano${Date.now()}`,
      tenantId,
      ...data,
    };
    mockData.planosFidelidade.push(novoPlano);
    return novoPlano;
  },

  updatePlano: (tenantId: string, planoId: string, data: Partial<Omit<PlanoFidelidade, 'id' | 'tenantId'>>): PlanoFidelidade | undefined => {
    const index = mockData.planosFidelidade.findIndex((p) => p.tenantId === tenantId && p.id === planoId);
    if (index === -1) return undefined;

    mockData.planosFidelidade[index] = {
      ...mockData.planosFidelidade[index],
      ...data,
    };
    return mockData.planosFidelidade[index];
  },

  deletePlano: (tenantId: string, planoId: string): boolean => {
    const index = mockData.planosFidelidade.findIndex((p) => p.tenantId === tenantId && p.id === planoId);
    if (index === -1) return false;

    mockData.planosFidelidade.splice(index, 1);
    return true;
  },
};
