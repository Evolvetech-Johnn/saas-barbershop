# Handoff — Barbearia SaaS

Documento de retomada. Escrito ao final de uma sessão longa que levou o projeto de "protótipo com Mongo/Prisma quebrados e dados mockados" a "SaaS publicado em produção, multi-tenant, com segurança real". Leia isto antes de mexer no projeto de novo — economiza redescobrir decisões e armadilhas já mapeadas.

## Estado atual (produção)

| Camada | Onde | Status |
|---|---|---|
| Frontend | `https://saas-barbershop-tan.vercel.app` (Vercel) | No ar |
| Backend | `https://saas-barbershop-kk5e.onrender.com` (Render, plano free) | No ar — **hiberna sem tráfego, ~30-50s pra acordar na primeira visita** |
| Banco | Supabase (Postgres) | No ar |
| Upload de imagem | Cloudinary | Configurado e testado |
| Pagamento | Stripe | **Não configurado** — decisão deliberada, sem cliente ainda não faz sentido |
| Repo | `github.com/Evolvetech-Johnn/saas-barbershop`, branch `main` | Tudo commitado (`e8ddcad`) |

### Logins de teste que já existem no banco
- Superadmin: `admin@barbearia-saas.com` / `admin123` — tenant "Painel SaaS Admin", slug `plataforma-admin`
- Tenant demo "Barbearia Classic" (slug `classic`) existe mas **sem usuário de login próprio** ainda

## Arquitetura (resumo)

- **Frontend**: React + Vite + TS, `src/`. Multi-tenant via `TenantContext` (resolve o tenant pelo slug da URL pública, ou pelo `tenantId` do usuário logado).
- **Backend**: Fastify + TS, `server/src/`. Rotas em `server/src/routes/*.ts` (autoload), services em `server/src/services/*.ts`.
- **Banco**: Postgres via Supabase. Schema único em `supabase-schema.sql` (raiz) — é a fonte da verdade, rode no SQL editor do Supabase antes de qualquer deploy novo.
- **Auth**: JWT (`@fastify/jwt`). `tenantId` e `role` vêm **só** do token verificado (`requireAuth`/`requireAdmin` em `server/src/middlewares/authMiddleware.ts`), nunca de headers do cliente.

## Decisões e armadilhas importantes (não redescobrir isso)

1. **Nunca confie no header `x-tenant-id` sozinho.** Rotas protegidas usam `requireAuth`, que popula `request.tenantId` a partir do JWT. Rotas públicas (booking, página institucional) continuam lendo o header porque não há sessão — é esperado, não é um buraco de segurança.

2. **Slugs reservados.** `admin`, `app`, `styleguide` colidem com rotas internas do frontend (`/admin/*` é o superadmin). Existe uma trava (`server/src/lib/reservedSlugs.ts`) que impede criar/editar um tenant com esses slugs — **não remova essa validação**. Foi exatamente esse bug que causava o logout ir pro lugar errado.

3. **Ordem de FK no `seed.ts` importa.** `clientes` referencia `planos_fidelidade`, então tem que ser deletado **antes** dele no reset do seed (`server/src/scripts/seed.ts`). Se adicionar tabela nova, adicione a checagem de erro no delete também — antes isso falhava calado e deixava lixo no banco.

4. **Logout precisa de reload completo, não `navigate()` do react-router.** Existe uma race condition real: se a rota protegida atual ainda está montada no instante em que a sessão vira `null`, o guard dela (`ProtectedRoute`) dispara seu próprio redirect e vence a corrida contra qualquer `navigate()` chamado manualmente. A solução usada em `Topbar.tsx`, `SuperAdminLayout.tsx` e `LoginPage.tsx`: `await logout(); window.location.hash = '#/destino'; window.location.reload();`. Não troque isso por um `navigate()` simples sem testar — já quebrou 3 vezes nesta sessão.

5. **`API_BASE_URL` do frontend vem de `VITE_API_URL`** (`src/config/api.ts`), com fallback pro localhost. Isso é lido **em build time**, não em runtime — mudar a env var no Vercel exige um redeploy manual pra valer.

6. **Backend no Render precisa do `Language: Docker`, não `Node`** (ou, se usar Node, o Build Command tem que ser `npm install && npm run build`, não só `npm install` — senão o `dist/` nunca é gerado). O `server/Dockerfile` já resolve isso sozinho se escolher Docker.

7. **`.env` nunca vai pro git** — está no `.gitignore` (root e server), com exceção dos `.env.example`. As credenciais reais (Supabase, Cloudinary, JWT) só existem no `server/.env` local e nas env vars do Render/Vercel.

8. **`role` vs `papel`**: o backend usa `papel` no objeto `user` retornado pelo login (bate com `Usuario.papel` do frontend). Se algum dia reaparecer um campo `role` num objeto de usuário do frontend, é bug — o `RoleBasedRoute` do superadmin já quebrou por causa dessa inconsistência uma vez.

## O que foi feito nesta sessão (ordem cronológica)

1. **Fundação**: migração completa de Mongoose/MongoDB + Prisma (mortos, nunca funcionaram direito) pra Postgres via Supabase. Schema único em `supabase-schema.sql`.
2. **Superadmin real**: saiu do mock, passou a usar dados reais (`server/src/services/superadminService.ts`), incluindo estatísticas por tenant e catálogo de planos SaaS editável.
3. **Stripe**: checkout, portal de billing e webhooks integrados (`server/src/routes/stripe.ts`, `stripeService.ts`) — funcional, só falta configurar as chaves quando tiver o primeiro cliente.
4. **Testes + CI**: Jest no backend, Vitest no frontend, GitHub Actions (`.github/workflows/ci.yml`).
5. **Auditoria de segurança**: nenhuma rota verificava JWT antes disso — qualquer requisição podia forjar `x-tenant-id` e ler/escrever dados de qualquer barbearia. Corrigido em todas as rotas privadas. Login do superadmin também era 100% mock (credenciais hardcoded no frontend) — virou login real.
6. **Gestão de equipe**: dono da barbearia pode criar acessos de funcionário (`server/src/routes/usuarios.ts`, `src/components/equipe/AcessosEquipe.tsx`). Acesso com papel "profissional" cria automaticamente o registro espelho em `profissionais` (o que aparece na agenda pública).
7. **Página pública de verdade**: "Serviços" e "Equipe" na landing page eram 100% hardcoded (nomes fixos tipo "João Silva", "Corte Clássico", iguais pra qualquer tenant) — reescrito pra usar dados reais. Disponibilidade de horário no agendamento público também era mockada — agora calcula de verdade contra os agendamentos existentes (`GET /agendamentos/disponibilidade`).
8. **Cloudinary**: upload de logo e galeria de fotos, com fallback gracioso se as credenciais não estiverem configuradas (não derruba o servidor).
9. **Deploy**: `Dockerfile` do backend, `VITE_API_URL` configurável, publicado em Vercel + Render, testado ponta a ponta em produção (login real, CORS liberado, upload funcionando).

## Onde estão as credenciais

- **Local**: `server/.env` (não versionado — veja `server/.env.example` pro template)
- **Produção**: env vars direto no dashboard do Render (backend) e do Vercel (frontend, só `VITE_API_URL`)
- Nada sensível está no código ou no histórico do git a partir do commit `e8ddcad` — houve um susto no meio da sessão (senha do Mongo antigo ficou exposta em commits anteriores, já fora de uso) documentado mas não corrigido via reescrita de histórico (ação destrutiva, não autorizada).

## Pendências conhecidas (não são bugs esquecidos, são escolhas)

- **Stripe**: sem configurar até ter o primeiro cliente pagante
- **WhatsApp**: escondido do menu — é mock (localStorage), nunca teve integração real com API nenhuma
- **E-mail** (confirmação de agendamento, recuperação de senha): nunca implementado, ficou fora do escopo por decisão do usuário
- **Upload de foto é só imagem única por vez** (não múltiplas de uma vez) — funcional, só não é o mais rápido pra galeria grande

## Se for continuar

- Rode `npx tsc --noEmit` (frontend e `server/`) e os testes (`npm test` nos dois) antes de mexer em qualquer coisa, pra confirmar que o estado local bate com o que está descrito aqui
- Qualquer mudança de schema precisa ser replicada manualmente no Supabase (não há migration runner configurado — `supabase-schema.sql` é aplicado à mão no SQL editor)
- Servidores locais de dev (se ainda rodando de sessões antigas): backend em `server/` (`npm run dev`, porta 3001), frontend na raiz (`npm run dev`, porta 5173)
