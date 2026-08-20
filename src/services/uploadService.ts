import { API_BASE_URL } from '@/config/api';

export const uploadService = {
  async uploadImagem(tenantId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = { 'x-tenant-id': tenantId };
    const token = localStorage.getItem('authToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Sem Content-Type manual: o browser define o boundary do multipart sozinho.
    const response = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', headers, body: formData });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Falha no upload da imagem');
    }
    const { url } = await response.json();
    return url;
  },
};
