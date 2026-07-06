import { Usuario } from '@/types/usuario';

export const authService = {
  // Simulated login. Default role is 'cliente'.
  // In production this should call the backend API `/api/auth/login` and return the real user payload.
  async login(email: string, senha: string): Promise<Usuario> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Default to 'cliente' to avoid granting admin rights by default.
    const papel = (email === 'admin@saas.com' && senha === 'admin123') ? 'admin' : 'cliente';

    return {
      id: '1',
      tenantId: '1',
      email,
      senha,
      nome: papel === 'admin' ? 'Administrador' : 'Cliente',
      papel,
      ativo: true,
    };
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
  },
};
