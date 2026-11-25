import type { Tenant } from '../services/tenantService';

// Campos que qualquer visitante pode ver (vitrine/agendamento público).
// Nunca inclui plano, status de cobrança, vencimento, ids do Stripe ou timestamps internos.
const PUBLIC_FIELDS = [
  'id', 'slug', 'nome', 'logoUrl', 'corAcento', 'descricaoPublica',
  'endereco', 'telefone', 'horarioFuncionamento', 'imagensGaleria',
] as const;

export function toPublicTenant(t: Tenant): Partial<Tenant> {
  const out: Record<string, unknown> = {};
  for (const k of PUBLIC_FIELDS) if (t[k] !== undefined) out[k] = t[k];
  // onboardingConcluido é só um boolean de UX e o frontend o usa para decidir o fluxo do dono logado
  return out as Partial<Tenant>;
}

// Visão do próprio dono (ou do superadmin): tudo, menos o id do cliente na Stripe.
export function toOwnerTenant(t: Tenant): Partial<Tenant> {
  const { stripeCustomerId, deletedAt, ...rest } = t;
  return rest;
}

// O dono só pode editar estes campos do próprio tenant. Plano, status, vencimento e Stripe
// mudam apenas por /superadmin/* ou pelo webhook da Stripe (nunca por PUT /tenants/:id).
const OWNER_EDITABLE = [
  'slug', 'nome', 'logoUrl', 'corAcento', 'descricaoPublica', 'endereco', 'telefone',
  'horarioFuncionamento', 'imagensGaleria', 'onboardingConcluido',
] as const;

export function pickOwnerEditable(body: Record<string, unknown> | undefined): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of OWNER_EDITABLE) if (body && body[k] !== undefined) out[k] = body[k];
  return out;
}
