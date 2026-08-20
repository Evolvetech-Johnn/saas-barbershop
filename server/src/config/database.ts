/** Supabase (Postgres) é HTTP-based via @fastify/... não há conexão persistente a validar,
 * só garantimos que as credenciais existem antes de subir o servidor. */
export async function connectDatabase(): Promise<void> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error(
      '[DB] SUPABASE_URL e SUPABASE_KEY são obrigatórias. Configure-as no .env (veja server/.env.example).'
    );
  }
  console.log('[DB] Configuração do Supabase OK');
}

export async function disconnectDatabase(): Promise<void> {
  // no-op: cliente Supabase não mantém conexão persistente para encerrar.
}
