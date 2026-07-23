import { apiRequest } from '@/config/api';
import { PlanoFidelidade, AssinaturaPlano } from '@/types/planoFidelidade';

export const planosService = {
  getPlanosByTenant: async (tenantId: string): Promise<PlanoFidelidade[]> => {
    return apiRequest<PlanoFidelidade[]>('/planos', {
      method: 'GET'
    }, tenantId);
  },

  getAssinaturas: async (tenantId: string): Promise<AssinaturaPlano[]> => {
    return apiRequest<AssinaturaPlano[]>('/assinaturas', {
      method: 'GET'
    }, tenantId);
  },

  assinarPlano: async (tenantId: string, clienteId: string, planoFidelidadeId: string): Promise<AssinaturaPlano> => {
    return apiRequest<AssinaturaPlano>('/assinaturas', {
      method: 'POST',
      body: JSON.stringify({ clienteId, planoFidelidadeId }),
    }, tenantId);
  },

  cancelarAssinatura: async (tenantId: string, assinaturaId: string): Promise<AssinaturaPlano> => {
    return apiRequest<AssinaturaPlano>(`/assinaturas/${assinaturaId}/cancelar`, {
      method: 'PATCH',
    }, tenantId);
  },
};
