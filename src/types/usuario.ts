export type PapelUsuario = 'admin' | 'profissional' | 'recepcao';

export interface Usuario {
  id: string;
  tenantId: string;
  email: string;
  senha: string;
  nome: string;
  papel: PapelUsuario;
  ativo: boolean;
  fotoUrl?: string;
}
