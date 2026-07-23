import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import { tenantService } from '@/services/tenantService';


interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  availableTenants: Tenant[];
  switchTenant: (slug: string) => void;
  updateTenant: (data: Partial<Tenant>) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    const fetchTenants = async () => {
      const tenants = await tenantService.getAllTenants();
      setAvailableTenants(tenants);
      if (tenants.length > 0 && !tenant) {
        const adminTenant = tenants.find((t) => t.slug === 'admin');
        setTenant(adminTenant || tenants[0]);
      }
    };
    fetchTenants();
  }, []);



  useEffect(() => {
    if (tenant) {
      document.documentElement.style.setProperty('--tenant-accent', tenant.corAcento);
    }
  }, [tenant]);

  const switchTenant = (slug: string) => {
    const foundTenant = availableTenants.find((t) => t.slug === slug);
    if (foundTenant) {
      setTenant(foundTenant);
    }
  };

  const updateTenant = async (data: Partial<Tenant>) => {
    if (!tenant) return;
    const currentId = (tenant as any)._id || tenant.id;
    const updated = await tenantService.updateTenant(currentId, data);
    if (updated) {
      setTenant(updated);
      const updatedId = (updated as any)._id || updated.id;
      const updatedList = availableTenants.map(t => ((t as any)._id || t.id) === updatedId ? updated : t);
      setAvailableTenants(updatedList);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, setTenant, availableTenants, switchTenant, updateTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

