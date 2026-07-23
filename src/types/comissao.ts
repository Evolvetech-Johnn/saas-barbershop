export interface Comissao {
  id: string;
  tenantId: string;
  comandaId: string;
  profissionalId: string;
  valor: number;
  percentual: number;
  status?: 'pendente' | 'paga';
  dataHora: Date | string;
}

export interface ComissaoResumo {
  profissionalId: string;
  profissionalNome: string;
  totalComissao: number;
  totalVendas: number;
  quantidadeAtendimentos: number;
}
