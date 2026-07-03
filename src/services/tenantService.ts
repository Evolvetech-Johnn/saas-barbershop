import { Tenant } from '@/types/tenant';
import { mockData } from '@/data/mockData';

const STORAGE_KEY = 'barbearia_tenants';

if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData.tenants));
}

export const tenantService = {
  async getAllTenants(): Promise<Tenant[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return parsed;
    } catch (e) {
      console.error('Error parsing tenants', e);
      return [];
    }
  },

  async getTenantBySlug(slug: string): Promise<Tenant | undefined> {
    const tenants = await tenantService.getAllTenants();
    return tenants.find(t => t.slug === slug);
  },

  async getTenantById(id: string): Promise<Tenant | undefined> {
    const tenants = await tenantService.getAllTenants();
    return tenants.find(t => t.id === id);
  },

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    const tenants = await tenantService.getAllTenants();
    const index = tenants.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updatedTenant = { ...tenants[index], ...data };
    tenants[index] = updatedTenant;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
    return updatedTenant;
  }
};

