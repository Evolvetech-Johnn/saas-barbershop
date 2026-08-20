import { ProfissionalService } from '../services/profissionalService';
import { requireAuth } from '../middlewares/authMiddleware';

// GET fica público: a página de agendamento do cliente final (sem login)
// precisa listar os profissionais da barbearia pra montar o booking.
const profissionaisRoutes = async (fastify: any, opts: any) => {
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

  fastify.post('/profissionais', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const newProfissional = await ProfissionalService.create({ ...request.body, tenantId: request.tenantId });
      return reply.status(201).send(newProfissional);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.put('/profissionais/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const updated = await ProfissionalService.update(request.tenantId, request.params.id, request.body);
      if (!updated) {
        return reply.status(404).send({ error: 'Profissional not found' });
      }
      return reply.send(updated);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete('/profissionais/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const deleted = await ProfissionalService.softDelete(request.tenantId, request.params.id);
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
