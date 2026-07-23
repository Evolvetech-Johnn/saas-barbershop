import { Tenant } from '@/types/tenant';
import { apiRequest } from '@/config/api';

export const tenantService = {
  async getAllTenants(): Promise<Tenant[]> {
    return apiRequest<Tenant[]>('/tenants');
  },

  async getTenantBySlug(slug: string): Promise<Tenant | undefined> {
    return apiRequest<Tenant>(`/tenants/slug/${slug}`);
  },

  async getTenantById(id: string): Promise<Tenant | undefined> {
    return apiRequest<Tenant>(`/tenants/${id}`);
  },

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    return apiRequest<Tenant>(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

