import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';

export interface ConteudoPublico {
  id: string;
  tenantId: string;
  titulo: string;
  resumo: string;
  categoria: string;
  conteudoCompleto?: string;
  imagemUrl?: string;
  dataPublicacao: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tabela sem soft delete (sem coluna deleted_at): "ativo=false" é o delete lógico.
export class ConteudoPublicoService {
  static async getAtivos(tenantId: string) {
    const { data, error } = await supabase
      .from('conteudos_publicos')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('ativo', true)
      .order('data_publicacao', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(rowToCamel<ConteudoPublico>);
  }

  static async getAll(tenantId: string) {
    const { data, error } = await supabase
      .from('conteudos_publicos')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('data_publicacao', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(rowToCamel<ConteudoPublico>);
  }

  static async getById(tenantId: string, id: string) {
    const { data, error } = await supabase.from('conteudos_publicos').select('*').eq('tenant_id', tenantId).eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<ConteudoPublico>(data) : null;
  }

  static async create(data: Partial<ConteudoPublico>) {
    const { data: row, error } = await supabase.from('conteudos_publicos').insert(dataToSnake(data)).select().single();
    if (error) throw new Error(error.message);
    return rowToCamel<ConteudoPublico>(row);
  }

  static async update(tenantId: string, id: string, data: Partial<ConteudoPublico>) {
    const { data: row, error } = await supabase
      .from('conteudos_publicos')
      .update(dataToSnake(data))
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<ConteudoPublico>(row) : null;
  }

  static async softDelete(tenantId: string, id: string) {
    return this.update(tenantId, id, { ativo: false });
  }
}
