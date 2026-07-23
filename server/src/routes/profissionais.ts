import { ProfissionalService } from '../services/profissionalService';
import { z } from 'zod';

const profissionaisRoutes = async (fastify: any, opts: any) => {
  // Get all profissionais by tenant
  fastify.get('/profissionais', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const profissionais = await ProfissionalService.getAll(tenantId);
      return reply.send(profissionais);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get profissional by ID
  fastify.get('/profissionais/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const profissional = await ProfissionalService.getById(tenantId, request.params.id);
      if (!profissional) {
        return reply.status(404).send({ error: 'Profissional not found' });
      }
      return reply.send(profissional);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
  // Create new profissional
  fastify.post('/profissionais', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const newProfissional = await ProfissionalService.create({ ...request.body, tenantId });
      return reply.status(201).send(newProfissional);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update profissional
  fastify.put('/profissionais/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const updated = await ProfissionalService.update(tenantId, request.params.id, request.body);
      if (!updated) {
        return reply.status(404).send({ error: 'Profissional not found' });
      }
      return reply.send(updated);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Delete (soft delete) profissional
  fastify.delete('/profissionais/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const deleted = await ProfissionalService.softDelete(tenantId, request.params.id);
      if (!deleted) {
        return reply.status(404).send({ error: 'Profissional not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default profissionaisRoutes;
