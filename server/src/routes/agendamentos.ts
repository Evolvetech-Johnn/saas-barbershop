import { AgendamentoService } from '../services/agendamentoService';
import { requireAuth } from '../middlewares/authMiddleware';

const agendamentosRoutes = async (fastify: any, opts: any) => {
  // Get all with optional date range
  fastify.get('/agendamentos', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const { startDate, endDate } = request.query;
      const agendamentos = await AgendamentoService.getAll(request.tenantId, startDate, endDate);
      return reply.send(agendamentos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get by ID
  fastify.get('/agendamentos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const agendamento = await AgendamentoService.getById(request.tenantId, request.params.id);
      if (!agendamento) {
        return reply.status(404).send({ error: 'Agendamento not found' });
      }
      return reply.send(agendamento);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Disponibilidade — pública: a página de agendamento usa isso pra só mostrar
  // horários realmente livres, em vez do cliente escolher um horário e
  // descobrir só na hora de confirmar que o profissional já está ocupado.
  fastify.get('/agendamentos/disponibilidade', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const { profissionalId, data, duracaoMinutos } = request.query;
      if (!profissionalId || !data || !duracaoMinutos) {
        return reply.status(400).send({ error: 'profissionalId, data e duracaoMinutos são obrigatórios' });
      }
      const horarios = await AgendamentoService.getHorariosDisponiveis(tenantId, profissionalId, data, Number(duracaoMinutos));
      return reply.send(horarios);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create — pública: usada pelo cliente final na página de agendamento (sem login),
  // o x-tenant-id vem da barbearia já identificada pelo slug na URL pública.
  fastify.post(
    '/agendamentos',
    { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } },
    async (request: any, reply: any) => {
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
    }
  );

  // Update
  fastify.put('/agendamentos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const atualizado = await AgendamentoService.update(request.tenantId, request.params.id, request.body);
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
  fastify.delete('/agendamentos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const deletado = await AgendamentoService.softDelete(request.tenantId, request.params.id);
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
