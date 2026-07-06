export type UserRole = 'admin' | 'profissional' | 'recepcao' | 'cliente';
export type PapelUsuario = UserRole;

export interface Usuario {
  id: string;
  tenantId: string;
  email: string;
  senha: string;
  nome: string;
  // User role stored in DB. Default should be 'cliente' for new users.
  papel: PapelUsuario;
  ativo: boolean;
  fotoUrl?: string;
}
