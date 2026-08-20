import { TenantService } from '../services/tenantService';
import { requireAuth } from '../middlewares/authMiddleware';
import { isReservedSlug } from '../lib/reservedSlugs';

// GET fica público: é o diretório básico (nome, slug, cor, logo) que o app
// usa pra resolver "qual barbearia é essa" antes mesmo do usuário logar
// (login, página pública de agendamento). Não expõe billing nem dados de
// outros clientes — isso vive em /superadmin/tenants, que é admin-only.
const tenantsRoutes = async (fastify: any, opts: any) => {
  fastify.get('/tenants', async (request: any, reply: any) => {
    try {
      const tenants = await TenantService.getAll();
      return reply.send(tenants);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/tenants/slug/:slug', async (request: any, reply: any) => {
    try {
      const tenant = await TenantService.getBySlug(request.params.slug);
      if (!tenant) {
        return reply.status(404).send({ error: 'Tenant not found' });
      }
      return reply.send(tenant);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/tenants/:id', async (request: any, reply: any) => {
    try {
      const tenant = await TenantService.getById(request.params.id);
      if (!tenant) {
        return reply.status(404).send({ error: 'Tenant not found' });
      }
      return reply.send(tenant);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update: só o próprio tenant logado pode editar os próprios dados
  // (usado por Onboarding/Configurações). Mudanças administrativas em
  // qualquer tenant passam por /superadmin/tenants.
  fastify.put('/tenants/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      if (request.tenantId !== request.params.id) {
        return reply.status(403).send({ error: 'Forbidden' });
      }
      if (request.body?.slug && isReservedSlug(request.body.slug)) {
        return reply.status(400).send({ error: `O slug "${request.body.slug}" é reservado pelo sistema. Escolha outro.` });
      }
      const updatedTenant = await TenantService.update(request.params.id, request.body);
      if (!updatedTenant) {
        return reply.status(404).send({ error: 'Tenant not found' });
      }
      return reply.send(updatedTenant);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default tenantsRoutes;
