import { supabase } from '../lib/supabase';

export class PromocaoService {
  static async getAtivas(tenantId: string) {
    const hoje = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('promocoes')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('ativo', true)
      .gte('data_fim', hoje);

    if (error) {
      console.error('Erro ao buscar promoções no Supabase:', error);
      throw new Error('Falha ao buscar promoções');
    }

    return data.map((item) => ({
      id: item.id,
      tenantId: item.tenant_id,
      titulo: item.titulo,
      descricao: item.descricao,
      destaque: item.destaque,
      imagemUrl: item.imagem_url,
      dataInicio: item.data_inicio,
      dataFim: item.data_fim,
      ativo: item.ativo,
    }));
  }

  // Métodos getAll, getById, create, update, softDelete omitidos para simplificar o plano focado no acesso público
}
