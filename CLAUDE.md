# Barbearia SaaS — instruções do projeto

SaaS multi-tenant de gestão de barbearias (Brasil). Frontend React + Vite (`src/`), backend Fastify + TS (`server/src/`), Postgres no Supabase. Leia `PROGRESS.md` e `HANDOFF.md` antes de começar e atualize o `PROGRESS.md` ao terminar uma etapa.

## Como a segurança funciona aqui (diferente do Medicare)
O backend usa a chave `service_role` do Supabase, que **ignora o RLS**. Logo, o isolamento entre barbearias é responsabilidade do **código do backend** e dos **testes**. Cada `where tenant_id` esquecido é um vazamento entre clientes.

## Regras permanentes
- `tenantId` e `role` vêm **só do JWT verificado** (`requireAuth`/`requireAdmin`). Nunca de body, query ou header em rota privada.
- `x-tenant-id` só é aceito em rota pública sem sessão (agendamento, vitrine). Toda rota nova privada usa `preHandler`.
- Toda query de tabela de tenant filtra por `tenant_id`. Toda tabela nova: `tenant_id`, `deleted_at` quando fizer sentido, e entrada no `supabase-schema.sql`.
- **Papel `admin` é o dono da barbearia, não o dono da plataforma.** Rota `/superadmin/*` e `/auth/admin-login` precisam distinguir o admin da plataforma (ver "Pendências de segurança" no `PROGRESS.md`).
- Slugs reservados (`admin`, `app`, `styleguide`): nunca remover a trava em `server/src/lib/reservedSlugs.ts`.
- Segredo (`SUPABASE_KEY`, `JWT_PRIVATE_KEY`, Stripe, Cloudinary) só no backend, lido via `server/src/lib/env.ts`. Nada secreto em `VITE_*`. Sem fallback de segredo no código (nada de `|| 'supersecret'`).
- Nunca devolver `error.message` do banco ao cliente em rota nova; logar no servidor e responder mensagem genérica.
- Dinheiro em **centavos inteiros** nas tabelas novas. Pagamento, comissão e estorno são insert-only: correção é novo lançamento, não edição.
- Nunca logar senha, hash, token, telefone ou e-mail de cliente. Sem dados reais em seed/dev.
- Mudança de schema: editar `supabase-schema.sql` **e** criar o arquivo numerado em `supabase/migrations/` (nunca editar uma migration já aplicada). Nada destrutivo sem aprovação. Aplicar à mão em produção (`/sync-schema`).
- Mudança que toque dado pessoal, foto de cliente, marketing/WhatsApp, cobrança recorrente (clube) ou fiscal: rodar o agente `conformidade-lgpd` antes de fechar a etapa. Ele aponta riscos; não substitui jurídico, DPO nem contador.
- Não prometer em tela ou material comercial o que não existe (WhatsApp real, e-mail, nota fiscal, Stripe ativo).
- Logout usa `await logout(); window.location.hash = ...; window.location.reload();` (race do `ProtectedRoute`). Não trocar por `navigate()`.
- `VITE_API_URL` é lido em build: mudar no Vercel exige redeploy.
- UI em pt-BR, status sempre com ícone + texto, datas com fuso `America/Sao_Paulo`. Design: `design-system/barbearia-saas/MASTER.md`.

## Agentes, comandos e hooks
- `tenant-isolation`: audita rotas do backend antes de mergear mudanças em `server/src/routes` ou `middlewares`.
- `conformidade-lgpd`: LGPD, cobrança recorrente, comissão/repasse, fiscal.
- `/deploy-check` antes de push na `main`; `/sync-schema` após mudar o schema.
- Testes-guarda em `server/src/architecture.test.ts` falham o CI se uma regra acima for quebrada. Se um teste-guarda falhar, corrija o código, não a lista de exceções, a menos que a rota seja realmente pública.

## Comandos
Frontend (raiz): `npm run dev` · `npm run build` · `npm run lint` · `npm test`
Backend (`server/`): `npm run dev` · `npm run build` · `npm test` · `npm run seed`
Antes de push: `npx tsc --noEmit` na raiz e em `server/`.
