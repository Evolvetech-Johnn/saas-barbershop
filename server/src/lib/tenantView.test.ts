import { toPublicTenant, toOwnerTenant, pickOwnerEditable } from './tenantView';

const full: any = {
  id: 't1', slug: 'classic', nome: 'Classic', corAcento: '#fff', planoSaas: 'premium', status: 'vencido',
  dataCriacao: 'x', dataVencimentoPlano: 'y', telefone: '43', stripeCustomerId: 'cus_123',
  createdAt: 'a', updatedAt: 'b', deletedAt: null, onboardingConcluido: true,
};

describe('toPublicTenant', () => {
  it('não expõe plano, status, vencimento, Stripe nem timestamps', () => {
    const out: any = toPublicTenant(full);
    for (const k of ['planoSaas', 'status', 'dataVencimentoPlano', 'stripeCustomerId', 'createdAt', 'updatedAt', 'deletedAt', 'onboardingConcluido']) {
      expect(out).not.toHaveProperty(k);
    }
    expect(out).toMatchObject({ id: 't1', slug: 'classic', nome: 'Classic', telefone: '43' });
  });
});

describe('toOwnerTenant', () => {
  it('mostra plano e status ao dono, mas nunca o id do cliente na Stripe', () => {
    const out: any = toOwnerTenant(full);
    expect(out.planoSaas).toBe('premium');
    expect(out).not.toHaveProperty('stripeCustomerId');
    expect(out).not.toHaveProperty('deletedAt');
  });
});

describe('pickOwnerEditable (mass assignment)', () => {
  it('descarta plano, status, vencimento e Stripe enviados pelo dono', () => {
    const out = pickOwnerEditable({
      nome: 'Novo', planoSaas: 'franquia', status: 'ativo', dataVencimentoPlano: '2099-01-01', stripeCustomerId: 'cus_x', id: 'outro',
    });
    expect(out).toEqual({ nome: 'Novo' });
  });
});
