import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import { tenantService } from '@/services/tenantService';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  availableTenants: Tenant[];
  switchTenant: (slug: string) => void;
  updateTenant: (data: Partial<Tenant>) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);

  useEffect(() => {
    const fetchTenants = async () => {
      const tenants = await tenantService.getAllTenants();
      setAvailableTenants(tenants);
      if (tenants.length > 0 && !tenant) {
        setTenant(tenants[0]);
      }
    };
    fetchTenants();
  }, []);

  // Quando o usuário loga, seleciona o tenant correspondente ao seu tenantId
  useEffect(() => {
    if (usuario && availableTenants.length > 0) {
      const userTenant = availableTenants.find((t) => t.id === usuario.tenantId);
      if (userTenant) {
        setTenant(userTenant);
      }
    }
  }, [usuario, availableTenants]);

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
    const updated = await tenantService.updateTenant(tenant.id, data);
    if (updated) {
      setTenant(updated);
      const updatedList = availableTenants.map(t => t.id === updated.id ? updated : t);
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

