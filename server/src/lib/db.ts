import { supabase } from './supabase';

const toSnake = (s: string) => s.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
const toCamel = (s: string) => s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());

export function rowToCamel<T = any>(row: any): T {
  const out: any = {};
  for (const k of Object.keys(row)) out[toCamel(k)] = row[k];
  return out;
}

export function dataToSnake(data: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const k of Object.keys(data)) {
    if (data[k] === undefined) continue;
    out[toSnake(k)] = data[k];
  }
  return out;
}

function assertNoError(error: any) {
  if (error) throw new Error(error.message);
}

/** CRUD genérico com isolamento por tenant_id + soft delete, para tabelas com esse formato padrão. */
export class Repo<T = any> {
  constructor(private table: string) {}

  async findAll(tenantId: string, orderBy = 'created_at', ascending = true): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order(orderBy, { ascending });
    assertNoError(error);
    return (data || []).map(rowToCamel<T>);
  }

  async findById(tenantId: string, id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    assertNoError(error);
    return data ? rowToCamel<T>(data) : null;
  }

  async create(data: Partial<T>): Promise<T> {
    const { data: row, error } = await supabase.from(this.table).insert(dataToSnake(data)).select().single();
    assertNoError(error);
    return rowToCamel<T>(row);
  }

  async update(tenantId: string, id: string, data: Partial<T>): Promise<T | null> {
    const { data: row, error } = await supabase
      .from(this.table)
      .update(dataToSnake(data))
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    assertNoError(error);
    return row ? rowToCamel<T>(row) : null;
  }

  async softDelete(tenantId: string, id: string): Promise<T | null> {
    return this.update(tenantId, id, { deletedAt: new Date().toISOString() } as any);
  }
}
