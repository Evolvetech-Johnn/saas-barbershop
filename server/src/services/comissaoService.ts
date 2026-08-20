import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';

export interface Comissao {
  id: string;
  tenantId: string;
  comandaId: string;
  profissionalId: string;
  valor: number;
  percentual: number;
  status: 'pendente' | 'paga';
  dataHora: string;
  createdAt: string;
  updatedAt: string;
}

export class ComissaoService {
  static async getAll(tenantId: string, profissionalId?: string) {
    let q = supabase
      .from('comissoes')
      .select('*, profissional:profissionais(nome), comanda:comandas(*)')
      .eq('tenant_id', tenantId);
    if (profissionalId) q = q.eq('profissional_id', profissionalId);
    const { data, error } = await q.order('data_hora', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row: any) => ({
      ...rowToCamel<Comissao>(row),
      profissional: row.profissional ? rowToCamel(row.profissional) : null,
      comanda: row.comanda ? rowToCamel(row.comanda) : null,
    }));
  }

  static async create(data: Partial<Comissao>) {
    const { data: row, error } = await supabase.from('comissoes').insert(dataToSnake(data)).select().single();
    if (error) throw new Error(error.message);
    return rowToCamel<Comissao>(row);
  }

  static async markAsPaid(tenantId: string, comissaoId: string) {
    const { data: row, error } = await supabase
      .from('comissoes')
      .update({ status: 'paga' })
      .eq('tenant_id', tenantId)
      .eq('id', comissaoId)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<Comissao>(row) : null;
  }

  static async delete(tenantId: string, comissaoId: string): Promise<boolean> {
    const { error, count } = await supabase
      .from('comissoes')
      .delete({ count: 'exact' })
      .eq('tenant_id', tenantId)
      .eq('id', comissaoId);
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }
}
