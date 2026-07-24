import { supabase } from '../lib/supabase';

export class ConteudoPublicoService {
  static async getAtivos(tenantId: string) {
    const { data, error } = await supabase
      .from('conteudos_publicos')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('ativo', true)
      .order('data_publicacao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar conteúdos no Supabase:', error);
      throw new Error('Falha ao buscar conteúdos');
    }

    return data.map((item) => ({
      id: item.id,
      tenantId: item.tenant_id,
      titulo: item.titulo,
      resumo: item.resumo,
      categoria: item.categoria,
      conteudoCompleto: item.conteudo_completo,
      imagemUrl: item.imagem_url,
      dataPublicacao: item.data_publicacao,
      ativo: item.ativo,
    }));
  }

  // Métodos adicionais omitidos para o escopo da página pública
}
