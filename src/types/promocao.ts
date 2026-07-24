export interface Promocao {
  id: string;
  tenantId: string;
  titulo: string;
  descricao: string;
  destaque: boolean;
  imagemUrl?: string;
  dataInicio: Date;
  dataFim: Date;
  ativo: boolean;
}
