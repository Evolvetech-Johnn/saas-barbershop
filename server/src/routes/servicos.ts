import { ServicoService } from '../services/servicoService';
import { requireAuth } from '../middlewares/authMiddleware';

// GET fica público: a página de agendamento do cliente final (sem login)
// precisa listar os serviços da barbearia pra montar o booking.
const servicosRoutes = async (fastify: any, opts: any) => {
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

  fastify.post('/servicos', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const novoServico = await ServicoService.create({ ...request.body, tenantId: request.tenantId });
      return reply.status(201).send(novoServico);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.put('/servicos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const atualizado = await ServicoService.update(request.tenantId, request.params.id, request.body);
      if (!atualizado) {
        return reply.status(404).send({ error: 'Servico not found' });
      }
      return reply.send(atualizado);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete('/servicos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const deletado = await ServicoService.softDelete(request.tenantId, request.params.id);
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
