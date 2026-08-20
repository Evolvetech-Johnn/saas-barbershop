import { supabase } from '../lib/supabase';
import { rowToCamel } from '../lib/db';

export class AssinaturaFidelidadeService {
  static async getAtivas(tenantId: string) {
    const { data, error } = await supabase
      .from('assinaturas_fidelidade')
      .select('*, cliente:clientes(nome,email,telefone), plano:planos_fidelidade(nome,preco_mensal,beneficios)')
      .eq('tenant_id', tenantId)
      .eq('status', 'ativo')
      .order('data_inicio', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row: any) => ({
      ...rowToCamel(row),
      cliente: row.cliente ? rowToCamel(row.cliente) : null,
      plano: row.plano ? rowToCamel(row.plano) : null,
    }));
  }

  static async assinar(tenantId: string, clienteId: string, planoFidelidadeId: string) {
    const { data: existing } = await supabase
      .from('assinaturas_fidelidade')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('cliente_id', clienteId)
      .eq('status', 'ativo')
      .maybeSingle();
    if (existing) throw new Error('Cliente já possui uma assinatura ativa.');

    const { data, error } = await supabase
      .from('assinaturas_fidelidade')
      .insert({ tenant_id: tenantId, cliente_id: clienteId, plano_fidelidade_id: planoFidelidadeId, status: 'ativo' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return rowToCamel(data);
  }

  static async cancelar(tenantId: string, id: string) {
    const { data, error } = await supabase
      .from('assinaturas_fidelidade')
      .update({ status: 'cancelado', data_fim: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel(data) : null;
  }
}
