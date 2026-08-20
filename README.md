# Barbearia SaaS

Sistema de agendamento e gestão para barbearias, multi-tenant.

- **Frontend**: React + Vite (`/`), deploy estático (ex: Vercel — `vercel.json` já configurado).
- **Backend**: Fastify + TypeScript (`/server`), Postgres via Supabase. Tem `Dockerfile` pronto para qualquer plataforma que builde a partir de um container (Railway, Fly.io, Render, etc).

## Variáveis de ambiente do backend (`server/.env`)

Veja `server/.env.example` para o template. Obrigatórias para subir:

| Variável | Descrição |
|---|---|
| `SUPABASE_URL` / `SUPABASE_KEY` | Projeto Supabase (use a `service_role` key — o backend faz o isolamento por tenant no código, não via RLS do cliente) |
| `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` | Segredos de assinatura do token de sessão |
| `PORT` | Porta do servidor (padrão 3001/3000 conforme ambiente) |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Billing SaaS (Dashboard da Stripe → Developers) |
| `FRONTEND_URL` | Origem do frontend em produção — usada no CORS e nos redirects do Stripe Checkout |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Upload de logo e galeria de fotos das barbearias (raiz do Dashboard do Cloudinary) |

Antes do primeiro deploy, rode o `supabase-schema.sql` (raiz do repo) no SQL editor do seu projeto Supabase.

## Deploy do backend no Render

1. No [Render](https://dashboard.render.com), **New → Web Service**, conecta o repositório do GitHub
2. Runtime: **Docker**. Root Directory: `server` (ele detecta o `Dockerfile` sozinho ali dentro, sem precisar configurar build/start command)
3. Plano **Free**
4. Preenche as variáveis de ambiente da tabela acima, uma por uma
5. Não precisa configurar `PORT` — o Render injeta a própria porta automaticamente e o backend já respeita isso
6. Depois do primeiro deploy, copia a URL pública que o Render gerou (tipo `https://barbearia-saas-backend.onrender.com`) — é ela que vai no `VITE_API_URL` do Vercel (com `/api` no final), e o `FRONTEND_URL` aqui no Render deve apontar pra URL do Vercel

**Atenção ao plano gratuito do Render**: ele "dorme" depois de um tempo sem tráfego e demora ~30-50s pra acordar na primeira requisição depois disso. Não é bug do sistema, é limitação do plano free — se isso incomodar, o plano pago resolve.

## Variáveis de ambiente do frontend (Vercel)

O backend não roda no Vercel — só o frontend estático. O Vercel precisa de uma única variável, em **Project Settings → Environment Variables**:

| Variável | Valor |
|---|---|
| `VITE_API_URL` | URL pública do backend + `/api`, ex: `https://seu-backend.up.railway.app/api` |

Sem essa variável, o site em produção tenta chamar `localhost:3001` do navegador de quem visita — não funciona. Depois de configurar, é preciso rodar um novo deploy (o valor é embutido no build, não é lido em runtime).

O backend, por sua vez, precisa do `FRONTEND_URL` (tabela acima) apontando pra URL do Vercel, pra liberar o CORS.

## Rodando localmente

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (outro terminal, raiz do repo)
npm install
npm run dev
```

## Testes

```bash
# Backend
cd server && npm test

# Frontend
npm test
```

CI (GitHub Actions, `.github/workflows/ci.yml`) roda lint + typecheck + testes + build a cada push/PR na `main`.
