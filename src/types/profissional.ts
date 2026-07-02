export interface Profissional {
  id: string;
  tenantId: string;
  usuarioId?: string;
  nome: string;
  especialidade: string[];
  cor: string;
  ativo: boolean;
}
