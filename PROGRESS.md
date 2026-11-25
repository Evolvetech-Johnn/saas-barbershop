# PROGRESS — Barbearia SaaS

Regras do projeto: `CLAUDE.md`. Contexto e armadilhas: `HANDOFF.md`. Plano de referência (copiado do AgilizaMed/Medicare): `docs/` e o blueprint em `D:\Evolvetech\Webdesign\Projetos\clinica-agiliza-med\web\docs\product\blueprint-barbearias.md`.
`docs/PROGRESSO.md` é o checklist antigo das fases de UI; este arquivo é o vivo.

## Estado atual
Decisão (2026-11-25): **reforçar o projeto atual** (Fastify + React + Supabase), sem migrar para Next. Etapa 1 = Fundação.

## Fundação (2026-11-25)
- [x] `CLAUDE.md` com regras permanentes adaptadas à stack (isolamento no código, `service_role`)
- [x] Agente `conformidade-lgpd` adaptado (`.claude/agents/`)
- [x] `server/src/lib/env.ts`: valida variáveis no boot (falha em produção), remove o fallback `'supersecret'` do JWT
- [x] `server/src/architecture.test.ts`: toda rota (68) é protegida ou está na lista de públicas; `x-tenant-id` só em rotas públicas; sem fallback de segredo; slugs reservados
- [x] `supabase/migrations/` com baseline e regra de versionamento
Verificado: `tsc --noEmit` (server) e `npm test` no server (36 testes backend + 11 frontend). **Não verificado:** frontend, deploy no Render com o novo `assertEnv`.

## Pendências de segurança (achadas em 2026-11-25; 1 e 2 corrigidas no código)
1. ~~Escalada de privilégio~~ **Corrigida em 2026-11-25 (código; falta deploy).** `requirePlatformAdmin` exige papel `admin` + claim `platform: true`, emitida só para usuários do tenant `plataforma-admin` (`lib/platform.ts`); `/auth/admin-login` agora busca só nesse tenant; `/auth/refresh` recalcula a claim no banco; o slug `plataforma-admin` virou reservado. 7 testes novos. Efeito: tokens de superadmin antigos perdem acesso até novo login. Resta: `GET /superadmin/planos` segue com `requireAuth` (catálogo, leitura).
2. ~~`GET /tenants` público vazava tudo~~ **Corrigido (código; falta deploy).** Rotas públicas devolvem só campos de vitrine (`lib/tenantView.ts`); lista pública só com tenants `ativo` e sem `plataforma-admin`; o dono (ou superadmin) recebe a visão completa, sem `stripeCustomerId`. Achado extra no mesmo ponto: `PUT /tenants/:id` repassava o body inteiro, então o dono podia mudar o próprio `planoSaas`, `status` e `dataVencimentoPlano` — agora só campos editáveis (whitelist). Frontend: `AppRoutes` busca o tenant do usuário logado por id. Resta: o seletor de barbearias do `OnboardingPage` ainda lista todas as públicas (resquício do mock; só nome e cor).
3. **Senha `admin123`** do superadmin documentada no `HANDOFF.md` e ativa em produção: trocar e remover do doc.
4. Rotas devolvem `error.message` do banco ao cliente (vaza schema). Trocar por mensagem genérica + log.
5. `/auth/refresh` e JWT de 1 h/7 d sem revogação; `x-tenant-id` aceito para agendar sem validar que o tenant existe/está ativo (verificar).
6. Rate limit global 100/min por IP; login 5/min já existe.

## Risco do deploy desta etapa
O `Dockerfile` define `NODE_ENV=production`. Com o novo `assertEnv`, o backend **não sobe** no Render se `JWT_PRIVATE_KEY` tiver menos de 32 caracteres (ou for `secret`/`supersecret`/`changeme`) ou se `FRONTEND_URL` não estiver definida. Conferir as variáveis no Render **antes** do push; trocar o JWT invalida as sessões abertas.

## Próximas etapas
- [ ] Corrigir pendências 1–4 acima (cada uma com teste)
- [ ] `tests` de isolamento por tenant nos services (mock do Supabase ou banco de teste)
- [ ] MFA para o admin da plataforma
- [ ] `/api/health` com checagem de banco; logger sem dado pessoal
- [ ] E-mail (Resend) + fila de lembretes; WhatsApp real atrás de interface
- [ ] LGPD: termos, privacidade, consentimento, descadastro, foto com consentimento
- [ ] `dev-demo` com dados fictícios; landing honesta; oferta Fundador e scripts (ver `planejamento-venda-urgente.md` do AgilizaMed)
- [ ] Runbooks: deploy, backup/restauração, incidentes, rotação de chaves
- [ ] Comissão e pagamento insert-only; centavos inteiros

## Dívidas conhecidas
Stripe sem chaves; WhatsApp mock; sem e-mail; Render free hiberna; upload de foto uma por vez; schema aplicado à mão.
