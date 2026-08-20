import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';

export interface Tenant {
  id: string;
  slug: string;
  nome: string;
  logoUrl?: string;
  corAcento: string;
  planoSaas: 'start' | 'pro' | 'premium';
  status: 'ativo' | 'inativo' | 'vencido';
  dataCriacao: string;
  dataVencimentoPlano: string;
  descricaoPublica?: string;
  endereco?: string;
  telefone?: string;
  horarioFuncionamento?: string;
  imagensGaleria?: string[];
  onboardingConcluido?: boolean;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export class TenantService {
  static async getAll(): Promise<Tenant[]> {
    const { data, error } = await supabase.from('tenants').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map(rowToCamel<Tenant>);
  }

  static async getById(id: string): Promise<Tenant | null> {
    const { data, error } = await supabase.from('tenants').select('*').eq('id', id).is('deleted_at', null).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Tenant>(data) : null;
  }

  static async getBySlug(slug: string): Promise<Tenant | null> {
    const { data, error } = await supabase.from('tenants').select('*').eq('slug', slug).is('deleted_at', null).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel<Tenant>(data) : null;
  }

  static async create(data: Partial<Tenant>): Promise<Tenant> {
    const { data: row, error } = await supabase.from('tenants').insert(dataToSnake(data)).select().single();
    if (error) throw new Error(error.message);
    return rowToCamel<Tenant>(row);
  }

  static async update(id: string, data: Partial<Tenant>): Promise<Tenant | null> {
    const { data: row, error } = await supabase.from('tenants').update(dataToSnake(data)).eq('id', id).select().maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<Tenant>(row) : null;
  }

  static async softDelete(id: string): Promise<Tenant | null> {
    return this.update(id, { deletedAt: new Date().toISOString() } as any);
  }
}
