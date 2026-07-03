import { Produto } from '@/types/produto';
import { mockData } from '@/data/mockData';

export const estoqueService = {
  getProdutosByTenant: (tenantId: string): Produto[] => {
    return mockData.produtos.filter((p) => p.tenantId === tenantId);
  },

  getProdutoById: (tenantId: string, produtoId: string): Produto | undefined => {
    return mockData.produtos.find((p) => p.tenantId === tenantId && p.id === produtoId);
  },

  createProduto: (tenantId: string, data: Omit<Produto, 'id' | 'tenantId'>): Produto => {
    const novoProduto: Produto = {
      id: `prod${Date.now()}`,
      tenantId,
      ...data,
    };
    mockData.produtos.push(novoProduto);
    return novoProduto;
  },

  updateProduto: (tenantId: string, produtoId: string, data: Partial<Omit<Produto, 'id' | 'tenantId'>>): Produto | undefined => {
    const index = mockData.produtos.findIndex((p) => p.tenantId === tenantId && p.id === produtoId);
    if (index === -1) return undefined;

    mockData.produtos[index] = {
      ...mockData.produtos[index],
      ...data,
    };
    return mockData.produtos[index];
  },

  deleteProduto: (tenantId: string, produtoId: string): boolean => {
    const index = mockData.produtos.findIndex((p) => p.tenantId === tenantId && p.id === produtoId);
    if (index === -1) return false;

    mockData.produtos.splice(index, 1);
    return true;
  },

  getProdutosEstoqueBaixo: (tenantId: string): Produto[] => {
    return mockData.produtos.filter((p) => p.tenantId === tenantId && p.quantidade <= p.quantidadeMinima);
  },
};
