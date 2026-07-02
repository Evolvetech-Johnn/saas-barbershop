import { Usuario } from '@/types/usuario';

export const authService = {
  async login(email: string, senha: string): Promise<Usuario> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      id: '1',
      tenantId: '1',
      email,
      senha,
      nome: 'Administrador',
      papel: 'admin',
      ativo: true,
    };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};
