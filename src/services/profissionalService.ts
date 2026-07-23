import { Profissional } from '../types/profissional';
import { apiRequest } from '@/config/api';

export const profissionalService = {
  getAll: async (tenantId: string): Promise<Profissional[]> => {
    return apiRequest<Profissional[]>('/profissionais', {
      method: 'GET',
    }, tenantId);
  },

  getById: async (tenantId: string, id: string): Promise<Profissional> => {
    return apiRequest<Profissional>(`/profissionais/${id}`, {
      method: 'GET',
    }, tenantId);
  },

  create: async (tenantId: string, data: Partial<Profissional>): Promise<Profissional> => {
    return apiRequest<Profissional>('/profissionais', {
      method: 'POST',
      body: JSON.stringify(data),
    }, tenantId);
  },

  update: async (tenantId: string, id: string, data: Partial<Profissional>): Promise<Profissional> => {
    return apiRequest<Profissional>(`/profissionais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, tenantId);
  },

  delete: async (tenantId: string, id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/profissionais/${id}`, {
      method: 'DELETE',
    }, tenantId);
  },
};
