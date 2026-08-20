import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';

export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito';

export interface ItemComanda {
  tipo: 'servico' | 'produto';
  itemId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Comanda {
  id: string;
  tenantId: string;
  agendamentoId?: string;
  clienteId?: string;
  profissionalId: string;
  itens: ItemComanda[];
  formaPagamento: FormaPagamento;
  desconto: number;
  total: number;
  dataHora: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const SELECT_COM_RELACOES = '*, itens:comanda_itens(*), cliente:clientes(nome,telefone), profissional:profissionais(nome)';

function mapRow(row: any) {
  const base = rowToCamel<Comanda>(row);
  return {
    ...base,
    itens: (row.itens || []).map(rowToCamel),
    cliente: row.cliente ? rowToCamel(row.cliente) : null,
    profissional: row.profissional ? rowToCamel(row.profissional) : null,
  };
}

export class ComandaService {
  static async getAll(tenantId: string) {
    const { data, error } = await supabase
      .from('comandas')
      .select(SELECT_COM_RELACOES)
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('data_hora', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(mapRow);
  }

  static async getById(tenantId: string, id: string) {
    const { data, error } = await supabase
      .from('comandas')
      .select(SELECT_COM_RELACOES)
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data) : null;
  }

  // ponytail: sem transação real (Supabase REST não expõe multi-statement tx);
  // se a criação da comanda falhar em um passo seguinte, a comanda já criada
  // fica órfã. Upgrade: mover para uma função RPC no Postgres se isso doer.
  static async create(data: Partial<Comanda> & { itens: ItemComanda[] }) {
    const { itens, ...comandaData } = data;

    const { data: comandaRow, error } = await supabase.from('comandas').insert(dataToSnake(comandaData)).select().single();
    if (error) throw new Error(error.message);
    const comanda = rowToCamel<Comanda>(comandaRow);

    if (itens?.length) {
      const itensRows = itens.map((item) => ({ comanda_id: comanda.id, ...dataToSnake(item) }));
      const { error: itensError } = await supabase.from('comanda_itens').insert(itensRows);
      if (itensError) throw new Error(itensError.message);
    }

    if (comanda.profissionalId && comanda.total > 0) {
      const { error: comissaoError } = await supabase.from('comissoes').insert({
        tenant_id: comanda.tenantId,
        comanda_id: comanda.id,
        profissional_id: comanda.profissionalId,
        percentual: 50,
        valor: comanda.total * 0.5,
        status: 'pendente',
      });
      if (comissaoError) throw new Error(comissaoError.message);
    }

    if (comanda.agendamentoId) {
      await supabase.from('agendamentos').update({ status: 'concluido' }).eq('id', comanda.agendamentoId).eq('tenant_id', comanda.tenantId);
    }

    return this.getById(comanda.tenantId, comanda.id);
  }

  static async update(tenantId: string, id: string, data: Partial<Comanda>) {
    const { itens, ...comandaData } = data as any;
    const { data: row, error } = await supabase
      .from('comandas')
      .update(dataToSnake(comandaData))
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? this.getById(tenantId, id) : null;
  }

  static async softDelete(tenantId: string, id: string) {
    const { data: row, error } = await supabase
      .from('comandas')
      .update({ deleted_at: new Date().toISOString() })
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<Comanda>(row) : null;
  }
}
