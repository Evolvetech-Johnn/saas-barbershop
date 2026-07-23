import { apiRequest } from '@/config/api';
import { Comissao } from '@/types/comissao';

export const comissoesService = {
  getAll: async (tenantId: string, profissionalId?: string): Promise<Comissao[]> => {
    const params = profissionalId ? `?profissionalId=${profissionalId}` : '';
    return apiRequest<Comissao[]>(`/comissoes${params}`, {
      method: 'GET',
    }, tenantId);
  },

  pagar: async (tenantId: string, id: string): Promise<Comissao> => {
    return apiRequest<Comissao>(`/comissoes/${id}/pagar`, {
      method: 'PATCH',
    }, tenantId);
  },
};
