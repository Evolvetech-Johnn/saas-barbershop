import { Repo, rowToCamel } from '../lib/db';
import { supabase } from '../lib/supabase';

export interface Profissional {
  id: string;
  tenantId: string;
  usuarioId?: string;
  nome: string;
  especialidade: string[];
  cor: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const repo = new Repo<Profissional>('profissionais');

export class ProfissionalService {
  static getAll(tenantId: string) {
    return repo.findAll(tenantId, 'nome');
  }
  static getById(tenantId: string, id: string) {
    return repo.findById(tenantId, id);
  }
  static create(data: Partial<Profissional>) {
    return repo.create(data);
  }
  static update(tenantId: string, id: string, data: Partial<Profissional>) {
    return repo.update(tenantId, id, data);
  }
  static softDelete(tenantId: string, id: string) {
    return repo.softDelete(tenantId, id);
  }

  static async getByUsuarioId(tenantId: string, usuarioId: string): Promise<Profissional | null> {
    const { data, error } = await supabase
      .from('profissionais')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('usuario_id', usuarioId)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Profissional>(data) : null;
  }
}
