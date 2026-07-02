import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Tenant } from '@/types/tenant';
import { mockData } from '@/data/mockData';
import { useAuth } from './AuthContext';

interface TenantContextType {
  tenant: Tenant;
  setTenant: (tenant: Tenant) => void;
  availableTenants: Tenant[];
  switchTenant: (slug: string) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { usuario } = useAuth();
  const [tenant, setTenant] = useState<Tenant>(mockData.tenants[0]);
  const availableTenants = mockData.tenants;

  // Quando o usuário loga, seleciona o tenant correspondente ao seu tenantId
  useEffect(() => {
    if (usuario) {
      const userTenant = availableTenants.find((t) => t.id === usuario.tenantId);
      if (userTenant) {
        setTenant(userTenant);
      }
    }
  }, [usuario, availableTenants]);

  useEffect(() => {
    document.documentElement.style.setProperty('--tenant-accent', tenant.corAcento);
  }, [tenant]);

  const switchTenant = (slug: string) => {
    const foundTenant = availableTenants.find((t) => t.slug === slug);
    if (foundTenant) {
      setTenant(foundTenant);
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, setTenant, availableTenants, switchTenant }}>
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
