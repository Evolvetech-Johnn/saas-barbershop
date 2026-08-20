-- ============================================================================
-- Barbearia SaaS — schema Postgres/Supabase (fonte única de verdade)
-- Substitui Prisma/SQLite e Mongoose/MongoDB. Rode no SQL editor do Supabase.
-- Multi-tenant via RLS: toda linha carrega tenant_id, isolada por policy.
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Torna o script seguro de rodar de novo do zero (ex: depois de um erro no
-- meio da primeira execução). "cascade" cuida da ordem das foreign keys.
drop table if exists comanda_itens cascade;
drop table if exists comissoes cascade;
drop table if exists comandas cascade;
drop table if exists agendamentos cascade;
drop table if exists assinaturas_fidelidade cascade;
drop table if exists clientes cascade;
drop table if exists planos_fidelidade cascade;
drop table if exists produtos cascade;
drop table if exists servicos cascade;
drop table if exists profissionais cascade;
drop table if exists usuarios cascade;
drop table if exists faturas cascade;
drop table if exists assinaturas cascade;
drop table if exists planos_saas cascade;
drop table if exists conteudos_publicos cascade;
drop table if exists promocoes cascade;
drop table if exists tenants cascade;

-- ----------------------------------------------------------------------------
-- Tenants (barbearias) e planos SaaS
-- ----------------------------------------------------------------------------
create table tenants (
  id uuid primary key default uuid_generate_v4(),
  slug varchar not null unique,
  nome varchar not null,
  logo_url varchar,
  cor_acento varchar not null default '#3b82f6',
  plano_saas varchar not null default 'start' check (plano_saas in ('start','pro','premium')),
  status varchar not null default 'ativo' check (status in ('ativo','inativo','vencido')),
  data_criacao timestamptz not null default now(),
  data_vencimento_plano timestamptz not null,
  descricao_publica text,
  endereco varchar,
  telefone varchar,
  horario_funcionamento varchar,
  imagens_galeria text[] default '{}',
  onboarding_concluido boolean default false,
  stripe_customer_id varchar unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on tenants (status, plano_saas);

-- Catálogo de planos SaaS (Start/Pro/Premium) que o superadmin edita.
-- Distinto de `planos_fidelidade`, que é o plano de fidelidade que cada
-- barbearia (tenant) oferece aos próprios clientes.
create table planos_saas (
  id uuid primary key default uuid_generate_v4(),
  codigo varchar not null unique check (codigo in ('start','pro','premium')),
  nome varchar not null,
  preco numeric(10,2) not null check (preco >= 0),
  limite_profissionais int,
  limite_servicos int,
  limite_clientes int,
  recursos text[] default '{}',
  ativo boolean not null default true,
  stripe_price_id varchar,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Billing: assinatura Stripe por tenant (1:1 com a tela "Faturamento SaaS")
create table assinaturas (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id) unique,
  stripe_subscription_id varchar unique,
  stripe_price_id varchar,
  status varchar not null default 'trialing' check (status in ('trialing','active','past_due','canceled','unpaid')),
  periodo_atual_fim timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table faturas (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  stripe_invoice_id varchar unique,
  valor numeric(10,2) not null,
  status varchar not null check (status in ('paga','aberta','vencida','cancelada')),
  vencimento timestamptz not null,
  pago_em timestamptz,
  created_at timestamptz not null default now()
);
create index on faturas (tenant_id, vencimento);

-- ----------------------------------------------------------------------------
-- Usuários (login) e Profissionais (equipe)
-- ----------------------------------------------------------------------------
create table usuarios (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  email varchar not null,
  senha_hash varchar not null,
  nome varchar not null,
  papel varchar not null default 'cliente' check (papel in ('admin','profissional','recepcao','cliente')),
  ativo boolean not null default true,
  foto_url varchar,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (tenant_id, email)
);
create index on usuarios (tenant_id, papel, ativo);

create table profissionais (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  usuario_id uuid references usuarios(id),
  nome varchar not null,
  especialidade text[] default '{}',
  cor varchar not null default '#6366f1',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on profissionais (tenant_id, ativo);

-- ----------------------------------------------------------------------------
-- Catálogo: serviços, produtos, planos de fidelidade
-- ----------------------------------------------------------------------------
create table servicos (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  nome varchar not null,
  preco numeric(10,2) not null check (preco >= 0),
  duracao_minutos int not null default 30 check (duracao_minutos >= 1),
  comissao_percentual numeric(5,2) check (comissao_percentual between 0 and 100),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on servicos (tenant_id, ativo);

create table produtos (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  nome varchar not null,
  categoria varchar not null,
  preco numeric(10,2) not null check (preco >= 0),
  custo numeric(10,2) not null check (custo >= 0),
  quantidade int not null default 0 check (quantidade >= 0),
  quantidade_minima int not null default 5 check (quantidade_minima >= 0),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on produtos (tenant_id, categoria, ativo);

create table planos_fidelidade (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  nome varchar not null,
  descricao text not null,
  preco_mensal numeric(10,2) not null check (preco_mensal >= 0),
  beneficios text[] default '{}',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on planos_fidelidade (tenant_id, ativo);

-- ----------------------------------------------------------------------------
-- Clientes
-- ----------------------------------------------------------------------------
create table clientes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  nome varchar not null,
  telefone varchar not null,
  email varchar,
  data_nascimento date,
  observacoes text,
  plano_fidelidade_id uuid references planos_fidelidade(id),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on clientes (tenant_id, telefone);
create index on clientes (tenant_id, ativo);

-- Assinatura de cliente a um plano de fidelidade (distinto da tabela
-- `assinaturas`, que é o billing SaaS do tenant na Stripe)
create table assinaturas_fidelidade (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  cliente_id uuid not null references clientes(id),
  plano_fidelidade_id uuid not null references planos_fidelidade(id),
  data_inicio timestamptz not null default now(),
  data_fim timestamptz,
  status varchar not null default 'ativo' check (status in ('ativo','cancelado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index assinaturas_fidelidade_ativa_unica on assinaturas_fidelidade (tenant_id, cliente_id) where status = 'ativo';

-- ----------------------------------------------------------------------------
-- Agendamentos
-- ----------------------------------------------------------------------------
create table agendamentos (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  profissional_id uuid not null references profissionais(id),
  cliente_id uuid references clientes(id),
  servico_id uuid not null references servicos(id),
  data_hora timestamptz not null,
  duracao_minutos int not null default 30 check (duracao_minutos >= 1),
  status varchar not null default 'confirmado' check (status in ('confirmado','concluido','faltou','cancelado')),
  observacoes text,
  cliente_nome varchar not null,
  cliente_telefone varchar not null,
  cliente_email varchar,
  created_by uuid references usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create unique index agendamentos_slot_unico on agendamentos (tenant_id, profissional_id, data_hora) where deleted_at is null;
create index on agendamentos (tenant_id, status, data_hora);

-- ----------------------------------------------------------------------------
-- Comandas (venda: serviços + produtos) e itens
-- ----------------------------------------------------------------------------
create table comandas (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  agendamento_id uuid references agendamentos(id),
  cliente_id uuid references clientes(id),
  profissional_id uuid not null references profissionais(id),
  forma_pagamento varchar not null check (forma_pagamento in ('dinheiro','pix','cartao_credito','cartao_debito')),
  desconto numeric(10,2) not null default 0 check (desconto >= 0),
  total numeric(10,2) not null check (total >= 0),
  data_hora timestamptz not null default now(),
  created_by uuid references usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on comandas (tenant_id, data_hora);
create index on comandas (tenant_id, profissional_id, data_hora);

create table comanda_itens (
  id uuid primary key default uuid_generate_v4(),
  comanda_id uuid not null references comandas(id) on delete cascade,
  tipo varchar not null check (tipo in ('servico','produto')),
  item_id uuid not null,
  nome varchar not null,
  quantidade int not null default 1 check (quantidade >= 1),
  preco_unitario numeric(10,2) not null check (preco_unitario >= 0)
);
create index on comanda_itens (comanda_id);

-- ----------------------------------------------------------------------------
-- Comissões
-- ----------------------------------------------------------------------------
create table comissoes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  comanda_id uuid not null references comandas(id),
  profissional_id uuid not null references profissionais(id),
  valor numeric(10,2) not null check (valor >= 0),
  percentual numeric(5,2) not null check (percentual between 0 and 100),
  status varchar not null default 'pendente' check (status in ('pendente','paga')),
  data_hora timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on comissoes (tenant_id, profissional_id, data_hora);

-- ----------------------------------------------------------------------------
-- Conteúdo público e promoções (site institucional)
-- ----------------------------------------------------------------------------
create table promocoes (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  titulo varchar not null,
  descricao text not null,
  destaque boolean default false,
  imagem_url varchar,
  data_inicio timestamptz not null,
  data_fim timestamptz not null,
  ativo boolean default true,
  is_sugestao boolean default false,
  desconto_sugerido int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table conteudos_publicos (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references tenants(id),
  titulo varchar not null,
  resumo text not null,
  categoria varchar not null,
  conteudo_completo text,
  imagem_url varchar,
  data_publicacao timestamptz not null,
  ativo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================================
-- RLS — isolamento multi-tenant real
-- O backend Fastify autentica com a service_role key (bypassa RLS) e filtra
-- por tenant_id no código; RLS aqui é a rede de segurança caso alguma query
-- vaze sem o filtro, ou se o Supabase client anon for usado diretamente.
-- Para leitura pública (site institucional) via anon key, liberamos SELECT.
-- ============================================================================
alter table tenants enable row level security;
alter table planos_saas enable row level security;
alter table assinaturas enable row level security;
alter table faturas enable row level security;
alter table usuarios enable row level security;
alter table profissionais enable row level security;
alter table servicos enable row level security;
alter table produtos enable row level security;
alter table planos_fidelidade enable row level security;
alter table clientes enable row level security;
alter table agendamentos enable row level security;
alter table comandas enable row level security;
alter table comanda_itens enable row level security;
alter table comissoes enable row level security;
alter table assinaturas_fidelidade enable row level security;
alter table promocoes enable row level security;
alter table conteudos_publicos enable row level security;

-- service_role sempre passa (usado pelo backend). Anon só lê o necessário
-- para a página pública de agendamento/institucional.
create policy "anon leitura publica tenants" on tenants for select to anon using (deleted_at is null);
create policy "anon leitura publica servicos" on servicos for select to anon using (ativo and deleted_at is null);
create policy "anon leitura publica profissionais" on profissionais for select to anon using (ativo and deleted_at is null);
create policy "anon leitura publica promocoes" on promocoes for select to anon using (ativo);
create policy "anon leitura publica conteudos" on conteudos_publicos for select to anon using (ativo);
create policy "anon cria agendamento" on agendamentos for insert to anon with check (true);

-- ============================================================================
-- Seed: catálogo inicial de planos SaaS (editável depois pelo superadmin)
-- ============================================================================
insert into planos_saas (codigo, nome, preco, limite_profissionais, limite_servicos, limite_clientes, recursos) values
  ('start', 'Start', 49.90, 2, 10, 100, array['Agenda Online Simplificada','Até 2 Profissionais','Até 10 Serviços','Relatórios Básicos de Faturamento']),
  ('pro', 'Pro', 99.90, 5, null, null, array['Tudo do Plano Start','Até 5 Profissionais','Serviços e Clientes Ilimitados','Módulo de Estoque e Produtos','Módulo de Comissões Avançado']),
  ('premium', 'Premium', 199.90, null, null, null, array['Tudo do Plano Pro','Profissionais Ilimitados','Planos de Fidelidade / Assinaturas','Relatórios e BI Avançado','Suporte Prioritário'])
on conflict (codigo) do nothing;
