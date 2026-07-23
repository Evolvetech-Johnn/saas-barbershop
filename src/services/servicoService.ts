import { Servico } from '../types/servico';
import { apiRequest } from '@/config/api';

export const servicoService = {
  getAll: async (tenantId: string): Promise<Servico[]> => {
    return apiRequest<Servico[]>('/servicos', {
      method: 'GET',
    }, tenantId);
  },

  getById: async (tenantId: string, id: string): Promise<Servico> => {
    return apiRequest<Servico>(`/servicos/${id}`, {
      method: 'GET',
    }, tenantId);
  },

  create: async (tenantId: string, data: Partial<Servico>): Promise<Servico> => {
    return apiRequest<Servico>('/servicos', {
      method: 'POST',
      body: JSON.stringify(data),
    }, tenantId);
  },

  update: async (tenantId: string, id: string, data: Partial<Servico>): Promise<Servico> => {
    return apiRequest<Servico>(`/servicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, tenantId);
  },

  delete: async (tenantId: string, id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/servicos/${id}`, {
      method: 'DELETE',
    }, tenantId);
  },
};
