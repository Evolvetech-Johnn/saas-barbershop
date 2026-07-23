import { ClienteService } from '../services/clienteService';
import { z } from 'zod';

const clientesRoutes = async (fastify: any, opts: any) => {
  // Get all clientes by tenant
  fastify.get('/clientes', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const clientes = await ClienteService.getAll(tenantId);
      return reply.send(clientes);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get cliente by ID
  fastify.get('/clientes/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const cliente = await ClienteService.getById(tenantId, request.params.id);
      if (!cliente) {
        return reply.status(404).send({ error: 'Cliente not found' });
      }
      return reply.send(cliente);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create new cliente
  fastify.post('/clientes', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const novoCliente = await ClienteService.create({ ...request.body, tenantId });
      return reply.status(201).send(novoCliente);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update cliente
  fastify.put('/clientes/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const atualizado = await ClienteService.update(tenantId, request.params.id, request.body);
      if (!atualizado) {
        return reply.status(404).send({ error: 'Cliente not found' });
      }
      return reply.send(atualizado);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Delete cliente
  fastify.delete('/clientes/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const deletado = await ClienteService.softDelete(tenantId, request.params.id);
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
