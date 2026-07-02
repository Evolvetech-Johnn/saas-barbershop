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
