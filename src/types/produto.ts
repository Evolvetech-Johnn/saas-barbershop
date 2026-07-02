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
