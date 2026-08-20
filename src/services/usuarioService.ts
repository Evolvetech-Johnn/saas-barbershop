import { apiRequest } from '@/config/api';

export interface UsuarioAcesso {
  id: string;
  tenantId: string;
  email: string;
  nome: string;
  papel: 'admin' | 'profissional' | 'recepcao' | 'cliente';
  ativo: boolean;
  fotoUrl?: string;
}

export const usuarioService = {
  getAll: (tenantId: string) => apiRequest<UsuarioAcesso[]>('/usuarios', { method: 'GET' }, tenantId),

  create: (tenantId: string, data: { email: string; nome: string; papel: 'profissional' | 'recepcao' }) =>
    apiRequest<UsuarioAcesso & { senhaTemporaria: string }>('/usuarios', { method: 'POST', body: JSON.stringify(data) }, tenantId),

  update: (tenantId: string, id: string, data: Partial<Pick<UsuarioAcesso, 'nome' | 'papel' | 'ativo'>>) =>
    apiRequest<UsuarioAcesso>(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) }, tenantId),

  remove: (tenantId: string, id: string) => apiRequest<{ success: boolean }>(`/usuarios/${id}`, { method: 'DELETE' }, tenantId),
};
