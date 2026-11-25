import { sendError } from '../lib/httpError';
import { ClienteService } from '../services/clienteService';
import { requireAuth } from '../middlewares/authMiddleware';

const clientesRoutes = async (fastify: any, opts: any) => {
  // Get all clientes by tenant
  fastify.get('/clientes', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const clientes = await ClienteService.getAll(request.tenantId);
      return reply.send(clientes);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  // Get cliente by ID
  fastify.get('/clientes/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const cliente = await ClienteService.getById(request.tenantId, request.params.id);
      if (!cliente) {
        return reply.status(404).send({ error: 'Cliente not found' });
      }
      return reply.send(cliente);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  // Create new cliente
  fastify.post('/clientes', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const novoCliente = await ClienteService.create({ ...request.body, tenantId: request.tenantId });
      return reply.status(201).send(novoCliente);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  // Update cliente
  fastify.put('/clientes/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const atualizado = await ClienteService.update(request.tenantId, request.params.id, request.body);
      if (!atualizado) {
        return reply.status(404).send({ error: 'Cliente not found' });
      }
      return reply.send(atualizado);
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  // Delete cliente
  fastify.delete('/clientes/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const deletado = await ClienteService.softDelete(request.tenantId, request.params.id);
      if (!deletado) {
        return reply.status(404).send({ error: 'Cliente not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return sendError(reply, error);
    }
  });
};

export default clientesRoutes;
