import { ComandaService } from '../services/comandaService';

const comandasRoutes = async (fastify: any, opts: any) => {
  // Get all
  fastify.get('/comandas', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const comandas = await ComandaService.getAll(tenantId);
      return reply.send(comandas);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get by ID
  fastify.get('/comandas/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const comanda = await ComandaService.getById(tenantId, request.params.id);
      if (!comanda) {
        return reply.status(404).send({ error: 'Comanda not found' });
      }
      return reply.send(comanda);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create
  fastify.post('/comandas', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const nova = await ComandaService.create({ ...request.body, tenantId });
      return reply.status(201).send(nova);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update
  fastify.put('/comandas/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const atualizada = await ComandaService.update(tenantId, request.params.id, request.body);
      if (!atualizada) {
        return reply.status(404).send({ error: 'Comanda not found' });
      }
      return reply.send(atualizada);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Delete
  fastify.delete('/comandas/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const deletada = await ComandaService.softDelete(tenantId, request.params.id);
      if (!deletada) {
        return reply.status(404).send({ error: 'Comanda not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default comandasRoutes;
