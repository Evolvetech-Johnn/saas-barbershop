import { TenantService } from '../services/tenantService';

// O admin da PLATAFORMA é o usuário admin do tenant com este slug (criado pelo seed).
// Admin de qualquer outra barbearia é só o dono daquela barbearia.
export const PLATFORM_SLUG = 'plataforma-admin';

export async function getPlatformTenantId(): Promise<string | null> {
  const tenant = await TenantService.getBySlug(PLATFORM_SLUG);
  return tenant ? tenant.id : null;
}

export async function isPlatformTenant(tenantId: string): Promise<boolean> {
  return (await getPlatformTenantId()) === tenantId;
}
