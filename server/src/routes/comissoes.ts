import { ComissaoService } from '../services/comissaoService';

const comissoesRoutes = async (fastify: any, opts: any) => {
  // Get all
  fastify.get('/comissoes', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const { profissionalId } = request.query;
      const comissoes = await ComissaoService.getAll(tenantId, profissionalId);
      return reply.send(comissoes);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Mark as paid
  fastify.patch('/comissoes/:id/pagar', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const atualizada = await ComissaoService.markAsPaid(tenantId, request.params.id);
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
