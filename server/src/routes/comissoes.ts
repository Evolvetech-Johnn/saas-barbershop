import { ComissaoService } from '../services/comissaoService';
import { requireAuth } from '../middlewares/authMiddleware';

const comissoesRoutes = async (fastify: any, opts: any) => {
  fastify.get('/comissoes', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const { profissionalId } = request.query;
      const comissoes = await ComissaoService.getAll(request.tenantId, profissionalId);
      return reply.send(comissoes);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.patch('/comissoes/:id/pagar', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const atualizada = await ComissaoService.markAsPaid(request.tenantId, request.params.id);
      if (!atualizada) {
        return reply.status(404).send({ error: 'Comissao not found' });
      }
      return reply.send(atualizada);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default comissoesRoutes;
