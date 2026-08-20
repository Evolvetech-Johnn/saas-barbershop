import bcrypt from 'bcrypt';
import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';

export interface Usuario {
  id: string;
  tenantId: string;
  email: string;
  senhaHash: string;
  nome: string;
  papel: 'admin' | 'profissional' | 'recepcao' | 'cliente';
  ativo: boolean;
  fotoUrl?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

async function hashIfPresent(data: Partial<Usuario>) {
  if (data.senhaHash) data.senhaHash = await bcrypt.hash(data.senhaHash, 12);
  return data;
}

export class UsuarioService {
  static async getAll(tenantId: string): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(rowToCamel<Usuario>);
  }

  static async getById(tenantId: string, id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Usuario>(data) : null;
  }

  static async getByEmail(tenantId: string, email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('email', email)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Usuario>(data) : null;
  }

  static async getByIdAnyTenant(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase.from('usuarios').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Usuario>(data) : null;
  }

  /** Login do superadmin da plataforma não é escopado por tenant — busca por papel='admin' em qualquer tenant. */
  static async getAdminByEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('papel', 'admin')
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Usuario>(data) : null;
  }

  static async create(data: Partial<Usuario>): Promise<Usuario> {
    await hashIfPresent(data);
    const { data: row, error } = await supabase.from('usuarios').insert(dataToSnake(data)).select().single();
    if (error) throw new Error(error.message);
    return rowToCamel<Usuario>(row);
  }

  static async update(tenantId: string, id: string, data: Partial<Usuario>): Promise<Usuario | null> {
    await hashIfPresent(data);
    const { data: row, error } = await supabase
      .from('usuarios')
      .update(dataToSnake(data))
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<Usuario>(row) : null;
  }

  static async softDelete(tenantId: string, id: string): Promise<Usuario | null> {
    return this.update(tenantId, id, { deletedAt: new Date().toISOString() } as any);
  }

  static compareSenha(senha: string, senhaHash: string): Promise<boolean> {
    return bcrypt.compare(senha, senhaHash);
  }
}
