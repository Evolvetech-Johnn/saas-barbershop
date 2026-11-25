import { sendError } from '../lib/httpError';
import { ComandaService } from '../services/comandaService';
import { requireAuth } from '../middlewares/authMiddleware';

const comandasRoutes = async (fastify: any, opts: any) => {
  fastify.get('/comandas', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const comandas = await ComandaService.getAll(request.tenantId);
      return reply.send(comandas);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/comandas/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const comanda = await ComandaService.getById(request.tenantId, request.params.id);
      if (!comanda) {
        return reply.status(404).send({ error: 'Comanda not found' });
      }
      return reply.send(comanda);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.post('/comandas', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const nova = await ComandaService.create({ ...request.body, tenantId: request.tenantId });
      return reply.status(201).send(nova);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.put('/comandas/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const atualizada = await ComandaService.update(request.tenantId, request.params.id, request.body);
      if (!atualizada) {
        return reply.status(404).send({ error: 'Comanda not found' });
      }
      return reply.send(atualizada);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.delete('/comandas/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const deletada = await ComandaService.softDelete(request.tenantId, request.params.id);
      if (!deletada) {
        return reply.status(404).send({ error: 'Comanda not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });
};

export default comandasRoutes;
