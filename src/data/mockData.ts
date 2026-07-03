import { Tenant } from '@/types/tenant';
import { Profissional } from '@/types/profissional';
import { Servico } from '@/types/servico';
import { Cliente } from '@/types/cliente';
import { Produto } from '@/types/produto';
import { Comanda, FormaPagamento } from '@/types/comanda';
import { Comissao } from '@/types/comissao';
import { PlanoFidelidade, AssinaturaPlano } from '@/types/planoFidelidade';

export const mockData = {
  tenants: [
    {
      id: '1',
      slug: 'classic',
      nome: 'Barbearia Classic',
      logoUrl: 'https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=barbershop%20logo%20classic%20vintage%20black%20and%20gold&image_size=square',
      corAcento: '#d4af37',
      planoSaas: 'premium',
      status: 'ativo',
      dataCriacao: new Date('2024-01-01'),
      dataVencimentoPlano: new Date('2025-01-01'),
      descricaoPublica: 'Barbearia tradicional com estilo clássico, oferecendo cortes precisos e atendimento personalizado.',
      endereco: 'Rua das Flores, 123 - Centro, São Paulo',
      telefone: '(11) 98765-4321',
      horarioFuncionamento: 'Seg-Sex: 9h-19h | Sáb: 9h-17h',
    },
    {
      id: '2',
      slug: 'urban',
      nome: 'Barbearia Urban',
      logoUrl: 'https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=modern%20barbershop%20logo%20urban%20style%20black%20and%20green&image_size=square',
      corAcento: '#10b981',
      planoSaas: 'pro',
      status: 'ativo',
      dataCriacao: new Date('2024-06-01'),
      dataVencimentoPlano: new Date('2025-06-01'),
      descricaoPublica: 'Barbearia moderna com foco em estilo urbano e tendências contemporâneas.',
      endereco: 'Avenida Paulista, 456 - Bela Vista, São Paulo',
      telefone: '(11) 91234-5678',
      horarioFuncionamento: 'Seg-Sex: 10h-20h | Sáb: 10h-18h',
    },
    {
      id: '3',
      slug: 'premium',
      nome: 'Barbearia Premium',
      logoUrl: 'https://coresg-normal.trae.ai/api/v1/text_to_image?prompt=luxury%20barbershop%20logo%20premium%20black%20and%20copper&image_size=square',
      corAcento: '#ef4444',
      planoSaas: 'premium',
      status: 'ativo',
      dataCriacao: new Date('2023-01-01'),
      dataVencimentoPlano: new Date('2025-01-01'),
      descricaoPublica: 'Experiência premium de barbearia com serviços exclusivos e ambiente luxuoso.',
      endereco: 'Rua Oscar Freire, 789 - Jardins, São Paulo',
      telefone: '(11) 99876-5432',
      horarioFuncionamento: 'Seg-Sex: 9h-20h | Sáb: 9h-18h',
    },
  ] as Tenant[],
  profissionais: [
    { id: 'p1', tenantId: '1', nome: 'Carlos', especialidade: ['Corte', 'Barba'], cor: '#d4af37', ativo: true },
    { id: 'p2', tenantId: '1', nome: 'Ana', especialidade: ['Corte', 'Coloracao'], cor: '#f59e0b', ativo: true },
    { id: 'p3', tenantId: '2', nome: 'Bruno', especialidade: ['Corte', 'Barba'], cor: '#10b981', ativo: true },
  ] as Profissional[],
  servicos: [
    { id: 's1', tenantId: '1', nome: 'Corte de Cabelo', preco: 50, duracaoMinutos: 30, comissaoPercentual: 30, ativo: true },
    { id: 's2', tenantId: '1', nome: 'Barba', preco: 35, duracaoMinutos: 25, comissaoPercentual: 30, ativo: true },
    { id: 's3', tenantId: '1', nome: 'Corte + Barba', preco: 75, duracaoMinutos: 55, comissaoPercentual: 30, ativo: true },
    { id: 's4', tenantId: '1', nome: 'Spa do Barba', preco: 60, duracaoMinutos: 40, comissaoPercentual: 35, ativo: true },
  ] as Servico[],
  clientes: [
    { id: 'c1', tenantId: '1', nome: 'João Silva', telefone: '(11) 98765-4321', email: 'joao@email.com', ativo: true },
    { id: 'c2', tenantId: '1', nome: 'Maria Santos', telefone: '(11) 91234-5678', email: 'maria@email.com', ativo: true },
    { id: 'c3', tenantId: '1', nome: 'Pedro Costa', telefone: '(11) 99876-5432', ativo: true },
    { id: 'c4', tenantId: '1', nome: 'Lucas Ferreira', telefone: '(11) 91111-2222', ativo: true },
  ] as Cliente[],
  produtos: [
    { id: 'prod1', tenantId: '1', nome: 'Pomada Classic', categoria: 'Cabelo', preco: 45, custo: 20, quantidade: 15, quantidadeMinima: 5, ativo: true },
    { id: 'prod2', tenantId: '1', nome: 'Óleo de Barba', categoria: 'Barba', preco: 35, custo: 15, quantidade: 20, quantidadeMinima: 8, ativo: true },
    { id: 'prod3', tenantId: '1', nome: 'Shampoo Premium', categoria: 'Cabelo', preco: 55, custo: 25, quantidade: 10, quantidadeMinima: 5, ativo: true },
  ] as Produto[],
  comandas: [
    {
      id: 'com1',
      tenantId: '1',
      agendamentoId: 'ag1',
      clienteId: 'c1',
      profissionalId: 'p1',
      itens: [
        { tipo: 'servico' as const, itemId: 's1', nome: 'Corte de Cabelo', quantidade: 1, precoUnitario: 50 },
        { tipo: 'produto' as const, itemId: 'prod1', nome: 'Pomada Classic', quantidade: 1, precoUnitario: 45 },
      ],
      formaPagamento: 'pix' as FormaPagamento,
      total: 95,
      dataHora: new Date('2025-07-01T10:00:00'),
    },
    {
      id: 'com2',
      tenantId: '1',
      clienteId: 'c2',
      profissionalId: 'p2',
      itens: [
        { tipo: 'servico' as const, itemId: 's3', nome: 'Corte + Barba', quantidade: 1, precoUnitario: 75 },
      ],
      formaPagamento: 'cartao_credito' as FormaPagamento,
      total: 75,
      dataHora: new Date('2025-07-01T11:00:00'),
    },
    {
      id: 'com3',
      tenantId: '1',
      clienteId: 'c3',
      profissionalId: 'p1',
      itens: [
        { tipo: 'servico' as const, itemId: 's2', nome: 'Barba', quantidade: 1, precoUnitario: 35 },
        { tipo: 'produto' as const, itemId: 'prod2', nome: 'Óleo de Barba', quantidade: 2, precoUnitario: 35 },
      ],
      formaPagamento: 'dinheiro' as FormaPagamento,
      desconto: 10,
      total: 95,
      dataHora: new Date('2025-07-02T14:30:00'),
    },
    {
      id: 'com4',
      tenantId: '1',
      clienteId: 'c4',
      profissionalId: 'p2',
      itens: [
        { tipo: 'servico' as const, itemId: 's4', nome: 'Spa do Barba', quantidade: 1, precoUnitario: 60 },
      ],
      formaPagamento: 'cartao_debito' as FormaPagamento,
      total: 60,
      dataHora: new Date('2025-07-02T16:00:00'),
    },
  ] as Comanda[],
  comissoes: [
    {
      id: 'comissao1',
      tenantId: '1',
      comandaId: 'com1',
      profissionalId: 'p1',
      valor: 15,
      percentual: 30,
      dataHora: new Date('2025-07-01T10:00:00'),
    },
    {
      id: 'comissao2',
      tenantId: '1',
      comandaId: 'com2',
      profissionalId: 'p2',
      valor: 22.5,
      percentual: 30,
      dataHora: new Date('2025-07-01T11:00:00'),
    },
    {
      id: 'comissao3',
      tenantId: '1',
      comandaId: 'com3',
      profissionalId: 'p1',
      valor: 10.5,
      percentual: 30,
      dataHora: new Date('2025-07-02T14:30:00'),
    },
    {
      id: 'comissao4',
      tenantId: '1',
      comandaId: 'com4',
      profissionalId: 'p2',
      valor: 21,
      percentual: 35,
      dataHora: new Date('2025-07-02T16:00:00'),
    },
  ] as Comissao[],
  planosFidelidade: [
    {
      id: 'plano1',
      tenantId: '1',
      nome: 'Plano Classic',
      descricao: 'Ideal para clientes frequentes',
      precoMensal: 49.90,
      beneficios: [
        '10% de desconto em todos os serviços',
        'Corte mensal grátis',
        'Prioridade no agendamento'
      ],
      ativo: true
    },
    {
      id: 'plano2',
      tenantId: '1',
      nome: 'Plano Premium',
      descricao: 'Para quem quer o melhor',
      precoMensal: 99.90,
      beneficios: [
        '20% de desconto em todos os serviços',
        'Corte + Barba mensais grátis',
        'Prioridade no agendamento',
        '1 produto grátis por mês'
      ],
      ativo: true
    }
  ] as PlanoFidelidade[],
  assinaturas: [
    {
      id: 'assin1',
      clienteId: 'c1',
      planoFidelidadeId: 'plano1',
      dataInicio: new Date('2025-01-01'),
      status: 'ativo'
    },
    {
      id: 'assin2',
      clienteId: 'c2',
      planoFidelidadeId: 'plano2',
      dataInicio: new Date('2025-03-15'),
      status: 'ativo'
    }
  ] as AssinaturaPlano[],
};
