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
  onboardingConcluido?: boolean;
}
