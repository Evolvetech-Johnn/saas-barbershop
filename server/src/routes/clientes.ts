import { ClienteService } from '../services/clienteService';
import { requireAuth } from '../middlewares/authMiddleware';

const clientesRoutes = async (fastify: any, opts: any) => {
  // Get all clientes by tenant
  fastify.get('/clientes', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const clientes = await ClienteService.getAll(request.tenantId);
      return reply.send(clientes);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
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
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create new cliente
  fastify.post('/clientes', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const novoCliente = await ClienteService.create({ ...request.body, tenantId: request.tenantId });
      return reply.status(201).send(novoCliente);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
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
      return reply.status(500).send({ error: error.message });
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
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default clientesRoutes;
