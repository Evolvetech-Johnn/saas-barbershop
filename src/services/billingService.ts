import { apiRequest } from '@/config/api';

export const billingService = {
  criarCheckout: (tenantId: string, planoSaasId: string, email?: string) =>
    apiRequest<{ url: string }>('/stripe/checkout', { method: 'POST', body: JSON.stringify({ planoSaasId, email }) }, tenantId),

  abrirPortal: (tenantId: string) => apiRequest<{ url: string }>('/stripe/portal', { method: 'POST' }, tenantId),
};
