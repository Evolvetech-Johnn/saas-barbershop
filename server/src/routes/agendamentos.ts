import { AgendamentoService } from '../services/agendamentoService';

const agendamentosRoutes = async (fastify: any, opts: any) => {
  // Get all with optional date range
  fastify.get('/agendamentos', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const { startDate, endDate } = request.query;
      const agendamentos = await AgendamentoService.getAll(tenantId, startDate, endDate);
      return reply.send(agendamentos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get by ID
  fastify.get('/agendamentos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const agendamento = await AgendamentoService.getById(tenantId, request.params.id);
      if (!agendamento) {
        return reply.status(404).send({ error: 'Agendamento not found' });
      }
      return reply.send(agendamento);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create
  fastify.post('/agendamentos', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const novo = await AgendamentoService.create({ ...request.body, tenantId });
      return reply.status(201).send(novo);
    } catch (error: any) {
      if (error.message.includes('conflitante')) {
        return reply.status(409).send({ error: error.message });
      }
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update
  fastify.put('/agendamentos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const atualizado = await AgendamentoService.update(tenantId, request.params.id, request.body);
      if (!atualizado) {
        return reply.status(404).send({ error: 'Agendamento not found' });
      }
      return reply.send(atualizado);
    } catch (error: any) {
      if (error.message.includes('conflitante')) {
        return reply.status(409).send({ error: error.message });
      }
      return reply.status(500).send({ error: error.message });
    }
  });

  // Delete / Cancel
  fastify.delete('/agendamentos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const deletado = await AgendamentoService.softDelete(tenantId, request.params.id);
      if (!deletado) {
        return reply.status(404).send({ error: 'Agendamento not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default agendamentosRoutes;
