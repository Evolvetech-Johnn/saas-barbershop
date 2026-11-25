import { sendError } from '../lib/httpError';
import { TenantService } from '../services/tenantService';
import { requireAuth } from '../middlewares/authMiddleware';
import { isReservedSlug } from '../lib/reservedSlugs';
import { toPublicTenant, toOwnerTenant, pickOwnerEditable } from '../lib/tenantView';
import { PLATFORM_SLUG } from '../lib/platform';

// GET fica público: é o diretório básico (nome, slug, cor, logo) que o app
// usa pra resolver "qual barbearia é essa" antes mesmo do usuário logar
// (login, página pública de agendamento). Não expõe billing nem dados de
// outros clientes — isso vive em /superadmin/tenants, que é admin-only.
// Token opcional: rotas públicas devolvem a visão completa só ao dono do próprio tenant
// (ou ao admin da plataforma); qualquer outro visitante recebe só os campos de vitrine.
async function viewFor(request: any, tenant: any) {
  try {
    await request.jwtVerify();
    const u = request.user || {};
    if (u.platform === true || u.tenantId === tenant.id) return toOwnerTenant(tenant);
  } catch {
    /* sem sessão válida: visão pública */
  }
  return toPublicTenant(tenant);
}

const tenantsRoutes = async (fastify: any, opts: any) => {
  fastify.get('/tenants', async (request: any, reply: any) => {
    try {
      const tenants = await TenantService.getAll();
      // lista pública: só barbearias ativas, sem o tenant interno da plataforma
      return reply.send(tenants.filter((t) => t.status === 'ativo' && t.slug !== PLATFORM_SLUG).map(toPublicTenant));
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/tenants/slug/:slug', async (request: any, reply: any) => {
    try {
      const tenant = await TenantService.getBySlug(request.params.slug);
      if (!tenant || tenant.slug === PLATFORM_SLUG) {
        return reply.status(404).send({ error: 'Tenant not found' });
      }
      return reply.send(await viewFor(request, tenant));
    } catch (error: any) {
      return sendError(reply, error);
    }
  });

  fastify.get('/tenants/:id', async (request: any, reply: any) => {
    try {
      const tenant = await TenantService.getById(request.params.id);
      if (!tenant) {
        return reply.status(404).send({ error: 'Tenant not found' });
      }
      return reply.send(await viewFor(request, tenant));
    } catch (error: any) {
      return sendError(reply, error);
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
      const updatedTenant = await TenantService.update(request.params.id, pickOwnerEditable(request.body) as any);
      if (!updatedTenant) {
        return reply.status(404).send({ error: 'Tenant not found' });
      }
      return reply.send(toOwnerTenant(updatedTenant));
    } catch (error: any) {
      return sendError(reply, error);
    }
  });
};

export default tenantsRoutes;
