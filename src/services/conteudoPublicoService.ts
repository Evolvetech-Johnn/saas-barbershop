import { apiRequest } from '@/config/api';
import { ConteudoPublico } from '@/types/conteudoPublico';

export const getConteudosPublicos = async (tenantId: string): Promise<ConteudoPublico[]> => {
  return apiRequest<ConteudoPublico[]>('/conteudos', {}, tenantId);
};
