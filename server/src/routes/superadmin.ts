import { SuperadminService } from '../services/superadminService';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware';

const superadminRoutes = async (fastify: any, opts: any) => {
  fastify.get('/superadmin/tenants', { preHandler: requireAdmin }, async (_request: any, reply: any) => {
    try {
      return reply.send(await SuperadminService.getTenantsComEstatisticas());
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/superadmin/tenants', { preHandler: requireAdmin }, async (request: any, reply: any) => {
    try {
      const tenant = await SuperadminService.createTenant(request.body);
      return reply.status(201).send(tenant);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.patch('/superadmin/tenants/:id/status', { preHandler: requireAdmin }, async (request: any, reply: any) => {
    try {
      const { status } = request.body as { status: 'ativo' | 'inativo' };
      const tenant = await SuperadminService.setTenantStatus(request.params.id, status);
      if (!tenant) return reply.status(404).send({ error: 'Tenant not found' });
      return reply.send(tenant);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // GET fica aberto a qualquer usuário autenticado (não só admin): a tela de
  // Assinatura de cada barbearia precisa ler o catálogo de planos pra mostrar
  // preço/limites e permitir upgrade. Só a edição do catálogo é admin-only.
  fastify.get('/superadmin/planos', { preHandler: requireAuth }, async (_request: any, reply: any) => {
    try {
      return reply.send(await SuperadminService.getPlanos());
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.put('/superadmin/planos/:id', { preHandler: requireAdmin }, async (request: any, reply: any) => {
    try {
      const plano = await SuperadminService.updatePlano(request.params.id, request.body);
      if (!plano) return reply.status(404).send({ error: 'Plano not found' });
      return reply.send(plano);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/superadmin/faturas', { preHandler: requireAdmin }, async (_request: any, reply: any) => {
    try {
      return reply.send(await SuperadminService.getFaturas());
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.patch('/superadmin/faturas/:id/pagar', { preHandler: requireAdmin }, async (request: any, reply: any) => {
    try {
      const fatura = await SuperadminService.marcarFaturaPaga(request.params.id);
      if (!fatura) return reply.status(404).send({ error: 'Fatura not found' });
      return reply.send(fatura);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/superadmin/receita-trend', { preHandler: requireAdmin }, async (_request: any, reply: any) => {
    try {
      return reply.send(await SuperadminService.getReceitaTrend());
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default superadminRoutes;
