import { Cliente } from '@/types/cliente';
import { apiRequest } from '@/config/api';

export const clienteService = {
  getAll: async (tenantId: string): Promise<Cliente[]> => {
    return apiRequest<Cliente[]>('/clientes', {
      method: 'GET',
    }, tenantId);
  },

  getById: async (tenantId: string, id: string): Promise<Cliente> => {
    return apiRequest<Cliente>(`/clientes/${id}`, {
      method: 'GET',
    }, tenantId);
  },

  create: async (tenantId: string, data: Partial<Cliente>): Promise<Cliente> => {
    return apiRequest<Cliente>('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    }, tenantId);
  },

  update: async (tenantId: string, id: string, data: Partial<Cliente>): Promise<Cliente> => {
    return apiRequest<Cliente>(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, tenantId);
  },

  delete: async (tenantId: string, id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/clientes/${id}`, {
      method: 'DELETE',
    }, tenantId);
  },
};
