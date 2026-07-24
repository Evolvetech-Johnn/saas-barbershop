export type CategoriaConteudoPublico = 'dica' | 'curiosidade' | 'novidade';

export interface ConteudoPublico {
  id: string;
  tenantId: string;
  titulo: string;
  resumo: string;
  categoria: CategoriaConteudoPublico;
  conteudoCompleto?: string; // HTML ou Markdown
  imagemUrl?: string;
  dataPublicacao: Date;
  ativo: boolean;
}
