import { apiRequest } from '@/config/api';

export interface TenantSaaSDetails {
  id: string;
  nome: string;
  slug: string;
  planoSaas: 'start' | 'pro' | 'premium';
  status: 'ativo' | 'inativo' | 'vencido';
  dataCriacao: string;
  dataVencimentoPlano: string;
  faturamentoMensal: number;
  agendamentosRealizados: number;
  clientesCadastrados: number;
  profissionaisCadastrados: number;
  contatoEmail: string | null;
  contatoTelefone: string | null;
}

export interface SaaSPlan {
  id: string;
  codigo: 'start' | 'pro' | 'premium';
  nome: string;
  preco: number;
  limiteProfissionais: number | null;
  limiteServicos: number | null;
  limiteClientes: number | null;
  recursos: string[];
  ativo: boolean;
  totalAssinantes: number;
}

export interface SaaSInvoice {
  id: string;
  tenantId: string;
  tenant: { nome: string } | null;
  valor: number;
  status: 'paga' | 'aberta' | 'vencida' | 'cancelada';
  vencimento: string;
  pagoEm?: string;
}

export interface SaaSRevenueTrend {
  month: string;
  mrr: number;
  newSignups: number;
}

export const superadminService = {
  getTenants: () => apiRequest<TenantSaaSDetails[]>('/superadmin/tenants'),

  createTenant: (data: { nome: string; slug: string; planoSaas: string; email?: string; telefone?: string }) =>
    apiRequest<TenantSaaSDetails & { senhaTemporaria?: string }>('/superadmin/tenants', { method: 'POST', body: JSON.stringify(data) }),

  setTenantStatus: (id: string, status: 'ativo' | 'inativo') =>
    apiRequest(`/superadmin/tenants/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  getPlanos: () => apiRequest<SaaSPlan[]>('/superadmin/planos'),

  updatePlano: (id: string, data: Partial<SaaSPlan>) =>
    apiRequest<SaaSPlan>(`/superadmin/planos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getFaturas: () => apiRequest<SaaSInvoice[]>('/superadmin/faturas'),

  marcarFaturaPaga: (id: string) => apiRequest<SaaSInvoice>(`/superadmin/faturas/${id}/pagar`, { method: 'PATCH' }),

  getReceitaTrend: () => apiRequest<SaaSRevenueTrend[]>('/superadmin/receita-trend'),
};
