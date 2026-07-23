import { Produto } from '@/types/produto';
import { apiRequest } from '@/config/api';

export const estoqueService = {
  getAll: async (tenantId: string): Promise<Produto[]> => {
    return apiRequest<Produto[]>('/produtos', {
      method: 'GET',
    }, tenantId);
  },

  getById: async (tenantId: string, id: string): Promise<Produto> => {
    return apiRequest<Produto>(`/produtos/${id}`, {
      method: 'GET',
    }, tenantId);
  },

  create: async (tenantId: string, data: Partial<Produto>): Promise<Produto> => {
    return apiRequest<Produto>('/produtos', {
      method: 'POST',
      body: JSON.stringify(data),
    }, tenantId);
  },

  update: async (tenantId: string, id: string, data: Partial<Produto>): Promise<Produto> => {
    return apiRequest<Produto>(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, tenantId);
  },

  delete: async (tenantId: string, id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/produtos/${id}`, {
      method: 'DELETE',
    }, tenantId);
  },
};
