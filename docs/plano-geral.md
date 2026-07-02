# Plano Geral do Projeto

## 1. Módulos e Rotas

### Área do Tenant (/app)
- /app/login - Página de login
- /app/onboarding - Onboarding da barbearia
- /app/dashboard - Dashboard administrativo
- /app/agenda - Agenda de atendimentos
- /app/clientes - Listagem de clientes
- /app/clientes/:id - Detalhes do cliente
- /app/financeiro - Financeiro e comandas
- /app/comissoes - Comissões dos profissionais
- /app/estoque - Estoque de produtos
- /app/planos - Planos de fidelidade
- /app/relatorios - Relatórios e BI
- /app/configuracoes - Configurações da barbearia

### Página Pública (/:slug)
- /:slug - Página pública da barbearia (vitrine, serviços, profissionais)
- /:slug/agendar - Agendamento público (cliente final)
- /:slug/confirmacao - Confirmação de agendamento

### Painel Super Admin (/admin)
- /admin/login - Login do super admin
- /admin/tenants - Listagem de tenants (barbearias)
- /admin/tenants/:id - Detalhes do tenant
- /admin/planos - Planos do SaaS
- /admin/faturamento - Faturamento do SaaS

---

## 2. Estrutura de Pastas Final

```
barbearia-saas/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── PROGRESSO.md
├── docs/
│   ├── plano-geral.md          # Fase 0
│   └── backend-plan.md         # Fase 15
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx       # rotas /app, /agendar/:slug, /admin
│   ├── pages/
│   │   ├── app/                 # área logada do tenant (dono/barbeiro)
│   │   │   ├── LoginPage.tsx
│   │   │   ├── OnboardingPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── AgendaPage.tsx
│   │   │   ├── ClientesPage.tsx
│   │   │   ├── ClienteDetalhePage.tsx
│   │   │   ├── FinanceiroPage.tsx
│   │   │   ├── ComissoesPage.tsx
│   │   │   ├── EstoquePage.tsx
│   │   │   ├── PlanosFidelidadePage.tsx
│   │   │   ├── RelatoriosPage.tsx
│   │   │   └── ConfiguracoesPage.tsx
│   │   ├── public/               # página pública de agendamento (cliente final)
│   │   │   ├── PaginaPublicaPage.tsx
│   │   │   ├── AgendamentoPublicoPage.tsx
│   │   │   └── ConfirmacaoAgendamentoPage.tsx
│   │   └── superadmin/           # painel do dono do SaaS
│   │       ├── SuperAdminLoginPage.tsx
│   │       ├── TenantsPage.tsx
│   │       ├── TenantDetalhePage.tsx
│   │       ├── PlanosSaaSPage.tsx
│   │       └── FaturamentoSaaSPage.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   ├── PublicLayout.tsx
│   │   │   └── SuperAdminLayout.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── Avatar.tsx
│   │   ├── dashboard/
│   │   │   ├── KpiCard.tsx
│   │   │   ├── FaturamentoChart.tsx
│   │   │   ├── OcupacaoAgendaChart.tsx
│   │   │   └── ProximosAgendamentos.tsx
│   │   ├── agenda/
│   │   │   ├── CalendarioAgenda.tsx
│   │   │   ├── AgendamentoCard.tsx
│   │   │   ├── AgendamentoFormModal.tsx
│   │   │   ├── BloqueioHorarioModal.tsx
│   │   │   └── FiltroProfissional.tsx
│   │   ├── clientes/
│   │   │   ├── ClientesTable.tsx
│   │   │   ├── ClienteForm.tsx
│   │   │   └── ClienteHistorico.tsx
│   │   ├── financeiro/
│   │   │   ├── ComandaModal.tsx
│   │   │   ├── FluxoCaixaTable.tsx
│   │   │   └── FormasPagamentoChart.tsx
│   │   ├── comissoes/
│   │   │   ├── ComissaoPorProfissionalTable.tsx
│   │   │   └── RegraComissaoForm.tsx
│   │   ├── estoque/
│   │   │   ├── ProdutosTable.tsx
│   │   │   ├── ProdutoForm.tsx
│   │   │   └── AlertaEstoqueBaixo.tsx
│   │   ├── planos/
│   │   │   ├── PlanoFidelidadeCard.tsx
│   │   │   └── PlanoFidelidadeForm.tsx
│   │   ├── whatsapp/
│   │   │   ├── ConversasSimuladasList.tsx
│   │   │   └── AutomacaoMensagensForm.tsx
│   │   ├── publico/
│   │   │   ├── HeroPublico.tsx
│   │   │   ├── ServicosPublicos.tsx
│   │   │   ├── ProfissionaisPublicos.tsx
│   │   │   ├── SeletorServico.tsx
│   │   │   ├── SeletorProfissional.tsx
│   │   │   ├── SeletorHorario.tsx
│   │   │   └── ResumoAgendamento.tsx
│   │   └── superadmin/
│   │       ├── TenantsTable.tsx
│   │       ├── PlanoSaaSCard.tsx
│   │       └── ReceitaSaaSChart.tsx
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── TenantContext.tsx      # tenant ativo (marca, cores, plano)
│   │   └── ToastContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTenant.ts
│   │   ├── useAgenda.ts
│   │   ├── useClientes.ts
│   │   ├── useFinanceiro.ts
│   │   ├── useEstoque.ts
│   │   └── useLocalStorage.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── tenantService.ts
│   │   ├── agendaService.ts
│   │   ├── clientesService.ts
│   │   ├── financeiroService.ts
│   │   ├── comissoesService.ts
│   │   ├── estoqueService.ts
│   │   ├── planosService.ts
│   │   └── whatsappService.ts
│   ├── types/
│   │   ├── tenant.ts
│   │   ├── usuario.ts
│   │   ├── profissional.ts
│   │   ├── servico.ts
│   │   ├── agendamento.ts
│   │   ├── cliente.ts
│   │   ├── produto.ts
│   │   ├── comanda.ts
│   │   └── planoFidelidade.ts
│   ├── data/
│   │   └── mockData.ts            # dados de 2-3 tenants distintos
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── slug.ts
│   └── styles/
│       └── globals.css
└── public/
    └── assets/
```

---

## 3. Design Tokens e Identidade Visual

### Paleta Base
- Base (60%): Preto/Graphite (#0a0a0a, #141414, #1f1f1f)
- Apoio (30%): Cinzas claros (#f5f5f5, #e5e5e5, #d4d4d4)
- Ação (10%): Dourado/Cobre (#d4af37) — cor dinâmica por tenant

### Tipografia
- Display/Títulos: Playfair Display (via Google Fonts)
- Corpo/UI: Inter (via Google Fonts)

### Dinamismo por Tenant
Cada tenant terá sua própria cor de destaque, aplicada via variável CSS `--tenant-accent` consumida pelo Tailwind.

---

## 4. Modelagem dos Tipos TypeScript

```typescript
// tenant.ts
export interface Tenant {
  id: string;
  slug: string;
  nome: string;
  logoUrl: string;
  corAcento: string;
  planoSaas: 'start' | 'pro' | 'premium';
  status: 'ativo' | 'inativo' | 'vencido';
  dataCriacao: Date;
  dataVencimentoPlano: Date;
  // Dados da página pública
  descricaoPublica?: string;
  endereco?: string;
  telefone?: string;
  horarioFuncionamento?: string;
  imagensGaleria?: string[];
}

// usuario.ts
export type PapelUsuario = 'admin' | 'profissional' | 'recepcao';
export interface Usuario {
  id: string;
  tenantId: string;
  email: string;
  senha: string;
  nome: string;
  papel: PapelUsuario;
  ativo: boolean;
  fotoUrl?: string;
}

// profissional.ts
export interface Profissional {
  id: string;
  tenantId: string;
  usuarioId?: string;
  nome: string;
  especialidade: string[];
  cor: string;
  ativo: boolean;
}

// servico.ts
export interface Servico {
  id: string;
  tenantId: string;
  nome: string;
  preco: number;
  duracaoMinutos: number;
  comissaoPercentual?: number;
  ativo: boolean;
}

// agendamento.ts
export type StatusAgendamento = 'confirmado' | 'concluido' | 'faltou' | 'cancelado';
export interface Agendamento {
  id: string;
  tenantId: string;
  profissionalId: string;
  clienteId?: string;
  servicoId: string;
  dataHora: Date;
  status: StatusAgendamento;
  observacoes?: string;
  clienteNome: string;
  clienteTelefone: string;
}

// cliente.ts
export interface Cliente {
  id: string;
  tenantId: string;
  nome: string;
  telefone: string;
  email?: string;
  dataNascimento?: Date;
  observacoes?: string;
  planoFidelidadeId?: string;
  ativo: boolean;
}

// produto.ts
export interface Produto {
  id: string;
  tenantId: string;
  nome: string;
  categoria: string;
  preco: number;
  custo: number;
  quantidade: number;
  quantidadeMinima: number;
  ativo: boolean;
}

// comanda.ts
export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito';
export interface ItemComanda {
  tipo: 'servico' | 'produto';
  itemId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}
export interface Comanda {
  id: string;
  tenantId: string;
  agendamentoId?: string;
  clienteId?: string;
  profissionalId: string;
  itens: ItemComanda[];
  formaPagamento: FormaPagamento;
  desconto?: number;
  total: number;
  dataHora: Date;
}

// planoFidelidade.ts
export interface PlanoFidelidade {
  id: string;
  tenantId: string;
  nome: string;
  descricao: string;
  precoMensal: number;
  beneficios: string[];
  ativo: boolean;
}
export interface AssinaturaPlano {
  id: string;
  clienteId: string;
  planoFidelidadeId: string;
  dataInicio: Date;
  dataFim?: Date;
  status: 'ativo' | 'cancelado';
}
```

---

## 5. Tenants Fictícios

### 1. Barbearia Classic (slug: classic)
- Segmento: Tradicional/clássica
- Cor de acento: #d4af37 (dourado)
- Plano: Premium
- Página pública: Vitrine com serviços, profissionais e história da barbearia

### 2. Barbearia Urban (slug: urban)
- Segmento: Moderna/urbana
- Cor de acento: #10b981 (verde-petróleo)
- Plano: Pro
- Página pública: Vitrine com serviços, profissionais e estilo moderno

### 3. Barbearia Premium (slug: premium)
- Segmento: Luxo/high-end
- Cor de acento: #ef4444 (cobre/vermelho escuro)
- Plano: Premium
- Página pública: Vitrine premium com serviços exclusivos e profissionais de destaque

---

## 6. Fluxo de Navegação e Mapa de Rotas

### Fluxo do Tenant
1. /app/login → Login
2. /app/onboarding (se primeiro acesso)
3. /app/dashboard (homepage)
4. Navegação via sidebar para os outros módulos

### Fluxo do Cliente Final
1. /:slug → Página pública da barbearia (vitrine)
2. /:slug/agendar → Escolher serviço
3. /:slug/agendar → Escolher profissional
4. /:slug/agendar → Escolher horário
5. /:slug/agendar → Dados de contato
6. /:slug/confirmacao → Confirmação

### Fluxo do Super Admin
1. /admin/login → Login
2. /admin/tenants (homepage)
3. Navegação via sidebar para planos e faturamento
