import { Usuario } from '@/types/usuario';
import { apiRequest } from '@/config/api';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Usuario;
}

export const authService = {
  async login(email: string, password: string, tenantId?: string): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, tenantId);

    localStorage.setItem('authToken', response.token);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response;
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiRequest<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    localStorage.setItem('authToken', response.token);
    return response.token;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  },
};
