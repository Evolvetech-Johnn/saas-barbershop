// Leitura central das variáveis do backend. Em produção falha no boot se faltar
// algo obrigatório; em desenvolvimento só avisa. Nada de fallback de segredo.
type Env = Record<string, string | undefined>;

const REQUIRED_ALWAYS = ['SUPABASE_URL', 'SUPABASE_KEY'] as const;
const REQUIRED_IN_PRODUCTION = ['JWT_PRIVATE_KEY', 'FRONTEND_URL'] as const;
const WEAK_JWT = ['supersecret', 'secret', 'changeme'];

/** Retorna a lista de problemas encontrados (vazia = configuração ok). */
export function validateEnv(env: Env = process.env): string[] {
  const problems: string[] = [];
  const isProd = env.NODE_ENV === 'production';

  for (const name of REQUIRED_ALWAYS) {
    if (!env[name]) problems.push(`${name} não definida`);
  }
  if (isProd) {
    for (const name of REQUIRED_IN_PRODUCTION) {
      if (!env[name]) problems.push(`${name} não definida (obrigatória em produção)`);
    }
    const jwt = env.JWT_PRIVATE_KEY;
    if (jwt && (jwt.length < 32 || WEAK_JWT.includes(jwt.toLowerCase()))) {
      problems.push('JWT_PRIVATE_KEY fraca: use um valor aleatório com 32+ caracteres');
    }
  }
  const stripeKeys = [env.STRIPE_SECRET_KEY, env.STRIPE_WEBHOOK_SECRET];
  if (stripeKeys.some(Boolean) && !stripeKeys.every(Boolean)) {
    problems.push('STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET devem ser definidas juntas');
  }
  return problems;
}

/** Chame no início do bootstrap. Só nomes de variáveis aparecem no erro, nunca valores. */
export function assertEnv(env: Env = process.env): void {
  const problems = validateEnv(env);
  if (problems.length === 0) return;
  const message = `Configuração inválida:\n- ${problems.join('\n- ')}`;
  if (env.NODE_ENV === 'production') throw new Error(message);
  console.warn(`[env] ${message}`);
}

/** Segredo do JWT: sem fallback em produção. Em dev usa um valor local fixo. */
export function jwtSecret(env: Env = process.env): string {
  if (env.JWT_PRIVATE_KEY) return env.JWT_PRIVATE_KEY;
  if (env.NODE_ENV === 'production') throw new Error('JWT_PRIVATE_KEY não definida');
  return 'dev-only-jwt-secret-not-for-production';
}
