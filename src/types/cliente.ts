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
