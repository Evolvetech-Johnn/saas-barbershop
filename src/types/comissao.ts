export interface Comissao {
  id: string;
  tenantId: string;
  comandaId: string;
  profissionalId: string;
  valor: number;
  percentual: number;
  dataHora: Date;
}

export interface ComissaoResumo {
  profissionalId: string;
  profissionalNome: string;
  totalComissao: number;
  totalVendas: number;
  quantidadeAtendimentos: number;
}
