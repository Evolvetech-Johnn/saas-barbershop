import { validateEnv, jwtSecret } from './env';

const base = { SUPABASE_URL: 'https://x.supabase.co', SUPABASE_KEY: 'k' };

describe('validateEnv', () => {
  it('aceita dev só com as variáveis do Supabase', () => {
    expect(validateEnv({ ...base })).toEqual([]);
  });
  it('exige JWT e FRONTEND_URL em produção', () => {
    const p = validateEnv({ ...base, NODE_ENV: 'production' });
    expect(p.join()).toContain('JWT_PRIVATE_KEY');
    expect(p.join()).toContain('FRONTEND_URL');
  });
  it('recusa JWT fraco em produção e nunca imprime o valor', () => {
    const p = validateEnv({ ...base, NODE_ENV: 'production', FRONTEND_URL: 'https://a.b', JWT_PRIVATE_KEY: 'supersecret' });
    expect(p.join()).toContain('fraca');
    expect(p.join()).not.toContain('supersecret');
  });
  it('exige as duas chaves da Stripe juntas', () => {
    expect(validateEnv({ ...base, STRIPE_SECRET_KEY: 'sk' }).join()).toContain('STRIPE');
  });
});

describe('jwtSecret', () => {
  it('lança em produção sem a chave', () => {
    expect(() => jwtSecret({ NODE_ENV: 'production' })).toThrow();
  });
  it('usa a chave configurada', () => {
    expect(jwtSecret({ JWT_PRIVATE_KEY: 'abc' })).toBe('abc');
  });
});
