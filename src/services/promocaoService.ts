import { apiRequest } from '@/config/api';
import { Promocao } from '@/types/promocao';

export const getPromocoesPublicas = async (tenantId: string): Promise<Promocao[]> => {
  return apiRequest<Promocao[]>('/promocoes', {}, tenantId);
};
