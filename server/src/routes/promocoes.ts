import { PromocaoService } from '../services/promocaoService';
import { SmartMarketingService } from '../services/smartMarketingService';
import { supabase } from '../lib/supabase';
import { requireAuth } from '../middlewares/authMiddleware';

const promocoesRoutes = async (fastify: any, opts: any) => {
  // GET fica público: promoções ativas aparecem na página pública da barbearia.
  fastify.get('/promocoes', async (request: any, reply: any) => {
    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return reply.status(400).send({ message: 'Header x-tenant-id é obrigatório' });
    }

    try {
      const promocoes = await PromocaoService.getAtivas(tenantId);
      return reply.send(promocoes);
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar promoções' });
    }
  });

  // SMART MARKETING ENDPOINTS — ações internas do time da barbearia.
  fastify.post('/promocoes/gerar-sugestoes', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const sugestoes = await SmartMarketingService.analisarEGerarSugestoes(request.tenantId);
      return reply.send({ success: true, geradas: sugestoes.length, sugestoes });
    } catch (error: any) {
      return reply.status(500).send({ message: 'Erro ao gerar sugestões', error: error.message });
    }
  });

  fastify.get('/promocoes/sugestoes', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const { data, error } = await supabase
        .from('promocoes')
        .select('*')
        .eq('tenant_id', request.tenantId)
        .eq('is_sugestao', true);

      if (error) throw error;

      const sugestoes = data.map((item) => ({
        id: item.id,
        tenantId: item.tenant_id,
        titulo: item.titulo,
        descricao: item.descricao,
        destaque: item.destaque,
        imagemUrl: item.imagem_url,
        dataInicio: item.data_inicio,
        dataFim: item.data_fim,
        ativo: item.ativo,
        descontoSugerido: item.desconto_sugerido
      }));

      return reply.send(sugestoes);
    } catch (error: any) {
      return reply.status(500).send({ message: 'Erro ao buscar sugestões', error: error.message });
    }
  });

  fastify.put('/promocoes/aprovar-sugestao/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    const { id } = request.params;
    const updateData = request.body; // { titulo, descricao, data_inicio, data_fim, etc }

    try {
      const { data, error } = await supabase
        .from('promocoes')
        .update({
          titulo: updateData.titulo,
          descricao: updateData.descricao,
          data_inicio: updateData.dataInicio,
          data_fim: updateData.dataFim,
          ativo: true, // Quando aprova, ela se torna ativa
          is_sugestao: false, // Deixa de ser sugestão
          desconto_sugerido: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('tenant_id', request.tenantId)
        .select();

      if (error) throw error;

      return reply.send({ success: true, promocao: data[0] });
    } catch (error: any) {
      return reply.status(500).send({ message: 'Erro ao aprovar sugestão', error: error.message });
    }
  });
};

export default promocoesRoutes;
