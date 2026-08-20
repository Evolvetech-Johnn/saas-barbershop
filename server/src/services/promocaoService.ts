import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';

export interface Promocao {
  id: string;
  tenantId: string;
  titulo: string;
  descricao: string;
  destaque: boolean;
  imagemUrl?: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
  isSugestao: boolean;
  descontoSugerido?: number;
  createdAt: string;
  updatedAt: string;
}

// Tabela sem soft delete (sem coluna deleted_at): "ativo=false" é o delete lógico.
export class PromocaoService {
  static async getAtivas(tenantId: string) {
    const hoje = new Date().toISOString();
    const { data, error } = await supabase
      .from('promocoes')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('ativo', true)
      .gte('data_fim', hoje);
    if (error) throw new Error(error.message);
    return (data || []).map(rowToCamel<Promocao>);
  }

  static async getAll(tenantId: string) {
    const { data, error } = await supabase
      .from('promocoes')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('data_inicio', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(rowToCamel<Promocao>);
  }

  static async getById(tenantId: string, id: string) {
    const { data, error } = await supabase.from('promocoes').select('*').eq('tenant_id', tenantId).eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Promocao>(data) : null;
  }

  static async create(data: Partial<Promocao>) {
    const { data: row, error } = await supabase.from('promocoes').insert(dataToSnake(data)).select().single();
    if (error) throw new Error(error.message);
    return rowToCamel<Promocao>(row);
  }

  static async update(tenantId: string, id: string, data: Partial<Promocao>) {
    const { data: row, error } = await supabase
      .from('promocoes')
      .update(dataToSnake(data))
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<Promocao>(row) : null;
  }

  static async softDelete(tenantId: string, id: string) {
    return this.update(tenantId, id, { ativo: false });
  }
}
