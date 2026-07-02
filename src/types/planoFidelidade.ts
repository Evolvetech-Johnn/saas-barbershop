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
