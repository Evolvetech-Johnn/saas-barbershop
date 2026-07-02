import { Tenant } from '@/types/tenant';
import { mockData } from '@/data/mockData';

export const tenantService = {
  async getAllTenants(): Promise<Tenant[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData.tenants;
  },

  async getTenantBySlug(slug: string): Promise<Tenant | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockData.tenants.find(t => t.slug === slug);
  },
};
