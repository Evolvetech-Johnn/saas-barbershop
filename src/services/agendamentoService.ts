import { Agendamento } from '@/types/agendamento';
import { apiRequest } from '@/config/api';

export const agendamentoService = {
  getAll: async (tenantId: string, startDate?: string, endDate?: string): Promise<Agendamento[]> => {
    let url = '/agendamentos';
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return apiRequest<Agendamento[]>(url, {
      method: 'GET',
    }, tenantId);
  },

  getById: async (tenantId: string, id: string): Promise<Agendamento> => {
    return apiRequest<Agendamento>(`/agendamentos/${id}`, {
      method: 'GET',
    }, tenantId);
  },

  create: async (tenantId: string, data: Partial<Agendamento>): Promise<Agendamento> => {
    return apiRequest<Agendamento>('/agendamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    }, tenantId);
  },

  update: async (tenantId: string, id: string, data: Partial<Agendamento>): Promise<Agendamento> => {
    return apiRequest<Agendamento>(`/agendamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, tenantId);
  },

  delete: async (tenantId: string, id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/agendamentos/${id}`, {
      method: 'DELETE',
    }, tenantId);
  },
};
