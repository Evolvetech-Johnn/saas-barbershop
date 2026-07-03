export interface SaaSPlan {
  id: string;
  nome: string;
  preco: number;
  limiteProfissionais: number | 'ilimitado';
  limiteServicos: number | 'ilimitado';
  limiteClientes: number | 'ilimitado';
  recursos: string[];
  ativo: boolean;
  totalAssinantes: number;
}

export interface SaaSInvoice {
  id: string;
  tenantId: string;
  tenantNome: string;
  plano: string;
  valor: number;
  dataEmissao: string;
  dataVencimento: string;
  status: 'pago' | 'pendente' | 'vencido';
  formaPagamento?: string;
}

export interface SaaSRevenueTrend {
  month: string;
  mrr: number; // Monthly Recurring Revenue
  newSignups: number;
}

export interface TenantSaaSDetails {
  id: string;
  nome: string;
  slug: string;
  planoSaas: 'start' | 'pro' | 'premium';
  status: 'ativo' | 'inativo' | 'vencido';
  dataCriacao: string;
  dataVencimentoPlano: string;
  faturamentoMensal: number;
  agendamentosRealizados: number;
  clientesCadastrados: number;
  profissionaisCadastrados: number;
  contatoEmail: string;
  contatoTelefone: string;
}

export const mockSaaSPlans: SaaSPlan[] = [
  {
    id: 'plan_start',
    nome: 'Start',
    preco: 49.90,
    limiteProfissionais: 2,
    limiteServicos: 10,
    limiteClientes: 100,
    recursos: [
      'Agenda Online Simplificada',
      'Até 2 Profissionais',
      'Até 10 Serviços',
      'Relatórios Básicos de Faturamento'
    ],
    ativo: true,
    totalAssinantes: 12
  },
  {
    id: 'plan_pro',
    nome: 'Pro',
    preco: 99.90,
    limiteProfissionais: 5,
    limiteServicos: 'ilimitado',
    limiteClientes: 'ilimitado',
    recursos: [
      'Tudo do Plano Start',
      'Até 5 Profissionais',
      'Serviços e Clientes Ilimitados',
      'Módulo de Estoque e Produtos',
      'Módulo de Comissões Avançado'
    ],
    ativo: true,
    totalAssinantes: 28
  },
  {
    id: 'plan_premium',
    nome: 'Premium',
    preco: 199.90,
    limiteProfissionais: 'ilimitado',
    limiteServicos: 'ilimitado',
    limiteClientes: 'ilimitado',
    recursos: [
      'Tudo do Plano Pro',
      'Profissionais Ilimitados',
      'Automação de WhatsApp (Mock)',
      'Planos de Fidelidade / Assinaturas',
      'Relatórios e BI Avançado',
      'Suporte Prioritário'
    ],
    ativo: true,
    totalAssinantes: 15
  }
];

export const mockSaaSInvoices: SaaSInvoice[] = [
  {
    id: 'inv_1',
    tenantId: '1',
    tenantNome: 'Barbearia Classic',
    plano: 'Premium',
    valor: 199.90,
    dataEmissao: '2026-06-01',
    dataVencimento: '2026-06-05',
    status: 'pago',
    formaPagamento: 'cartao_credito'
  },
  {
    id: 'inv_2',
    tenantId: '2',
    tenantNome: 'Barbearia Urban',
    plano: 'Pro',
    valor: 99.90,
    dataEmissao: '2026-06-01',
    dataVencimento: '2026-06-05',
    status: 'pago',
    formaPagamento: 'pix'
  },
  {
    id: 'inv_3',
    tenantId: '3',
    tenantNome: 'Barbearia Premium',
    plano: 'Premium',
    valor: 199.90,
    dataEmissao: '2026-06-01',
    dataVencimento: '2026-06-05',
    status: 'pago',
    formaPagamento: 'cartao_credito'
  },
  {
    id: 'inv_4',
    tenantId: '4',
    tenantNome: 'Barba & Navalha',
    plano: 'Start',
    valor: 49.90,
    dataEmissao: '2026-06-03',
    dataVencimento: '2026-06-07',
    status: 'pago',
    formaPagamento: 'pix'
  },
  {
    id: 'inv_5',
    tenantId: '5',
    tenantNome: 'Club do Bigode',
    plano: 'Pro',
    valor: 99.90,
    dataEmissao: '2026-06-05',
    dataVencimento: '2026-06-10',
    status: 'pago',
    formaPagamento: 'boleto'
  },
  {
    id: 'inv_6',
    tenantId: '6',
    tenantNome: 'Viking Cut',
    plano: 'Pro',
    valor: 99.90,
    dataEmissao: '2026-06-25',
    dataVencimento: '2026-06-30',
    status: 'pendente'
  },
  {
    id: 'inv_7',
    tenantId: '7',
    tenantNome: 'Vintage Barber',
    plano: 'Start',
    valor: 49.90,
    dataEmissao: '2026-06-20',
    dataVencimento: '2026-06-25',
    status: 'vencido'
  }
];

export const mockSaaSRevenueTrend: SaaSRevenueTrend[] = [
  { month: '2026-01', mrr: 3500, newSignups: 4 },
  { month: '2026-02', mrr: 3900, newSignups: 5 },
  { month: '2026-03', mrr: 4500, newSignups: 7 },
  { month: '2026-04', mrr: 5100, newSignups: 6 },
  { month: '2026-05', mrr: 5900, newSignups: 9 },
  { month: '2026-06', mrr: 6384, newSignups: 5 }
];

export const mockTenantsDetails: TenantSaaSDetails[] = [
  {
    id: '1',
    nome: 'Barbearia Classic',
    slug: 'classic',
    planoSaas: 'premium',
    status: 'ativo',
    dataCriacao: '2024-01-01',
    dataVencimentoPlano: '2027-01-01',
    faturamentoMensal: 8450.00,
    agendamentosRealizados: 342,
    clientesCadastrados: 184,
    profissionaisCadastrados: 3,
    contatoEmail: 'classic@barbearia.com',
    contatoTelefone: '(11) 98765-4321'
  },
  {
    id: '2',
    nome: 'Barbearia Urban',
    slug: 'urban',
    planoSaas: 'pro',
    status: 'ativo',
    dataCriacao: '2024-06-01',
    dataVencimentoPlano: '2027-06-01',
    faturamentoMensal: 5120.00,
    agendamentosRealizados: 215,
    clientesCadastrados: 98,
    profissionaisCadastrados: 2,
    contatoEmail: 'urban@barbearia.com',
    contatoTelefone: '(11) 91234-5678'
  },
  {
    id: '3',
    nome: 'Barbearia Premium',
    slug: 'premium',
    planoSaas: 'premium',
    status: 'ativo',
    dataCriacao: '2023-01-01',
    dataVencimentoPlano: '2027-01-01',
    faturamentoMensal: 12890.00,
    agendamentosRealizados: 489,
    clientesCadastrados: 275,
    profissionaisCadastrados: 5,
    contatoEmail: 'premium@barbearia.com',
    contatoTelefone: '(11) 99876-5432'
  },
  {
    id: '4',
    nome: 'Barba & Navalha',
    slug: 'barba-navalha',
    planoSaas: 'start',
    status: 'ativo',
    dataCriacao: '2025-03-10',
    dataVencimentoPlano: '2026-10-10',
    faturamentoMensal: 2950.00,
    agendamentosRealizados: 110,
    clientesCadastrados: 64,
    profissionaisCadastrados: 1,
    contatoEmail: 'contato@barbanavalha.com',
    contatoTelefone: '(21) 98877-6655'
  },
  {
    id: '5',
    nome: 'Club do Bigode',
    slug: 'club-bigode',
    planoSaas: 'pro',
    status: 'ativo',
    dataCriacao: '2025-05-12',
    dataVencimentoPlano: '2026-12-12',
    faturamentoMensal: 6100.00,
    agendamentosRealizados: 245,
    clientesCadastrados: 130,
    profissionaisCadastrados: 3,
    contatoEmail: 'bigode@clubbigode.com',
    contatoTelefone: '(31) 97766-5544'
  },
  {
    id: '6',
    nome: 'Viking Cut',
    slug: 'viking-cut',
    planoSaas: 'pro',
    status: 'inativo',
    dataCriacao: '2025-08-20',
    dataVencimentoPlano: '2026-06-30',
    faturamentoMensal: 0.00,
    agendamentosRealizados: 0,
    clientesCadastrados: 12,
    profissionaisCadastrados: 2,
    contatoEmail: 'contato@vikingcut.com',
    contatoTelefone: '(41) 96655-4433'
  },
  {
    id: '7',
    nome: 'Vintage Barber',
    slug: 'vintage-barber',
    planoSaas: 'start',
    status: 'vencido',
    dataCriacao: '2025-10-01',
    dataVencimentoPlano: '2026-06-25',
    faturamentoMensal: 1450.00,
    agendamentosRealizados: 45,
    clientesCadastrados: 30,
    profissionaisCadastrados: 1,
    contatoEmail: 'vintage@barbershop.com',
    contatoTelefone: '(51) 95544-3322'
  }
];
