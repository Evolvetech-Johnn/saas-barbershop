export interface Servico {
  id: string;
  tenantId: string;
  nome: string;
  preco: number;
  duracaoMinutos: number;
  comissaoPercentual?: number;
  ativo: boolean;
}
