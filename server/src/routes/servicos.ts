import { ServicoService } from '../services/servicoService';
import { z } from 'zod';

const servicosRoutes = async (fastify: any, opts: any) => {
  // Get all servicos by tenant
  fastify.get('/servicos', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const servicos = await ServicoService.getAll(tenantId);
      return reply.send(servicos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get servico by ID
  fastify.get('/servicos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const servico = await ServicoService.getById(tenantId, request.params.id);
      if (!servico) {
        return reply.status(404).send({ error: 'Servico not found' });
      }
      return reply.send(servico);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create new servico
  fastify.post('/servicos', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const novoServico = await ServicoService.create({ ...request.body, tenantId });
      return reply.status(201).send(novoServico);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update servico
  fastify.put('/servicos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const atualizado = await ServicoService.update(tenantId, request.params.id, request.body);
      if (!atualizado) {
        return reply.status(404).send({ error: 'Servico not found' });
      }
      return reply.send(atualizado);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Delete servico
  fastify.delete('/servicos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const deletado = await ServicoService.softDelete(tenantId, request.params.id);
      if (!deletado) {
        return reply.status(404).send({ error: 'Servico not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default servicosRoutes;
