import { TenantService } from '../services/tenantService';
import { z } from 'zod';

const tenantsRoutes = async (fastify: any, opts: any) => {
  // Get all tenants
  fastify.get('/tenants', async (request: any, reply: any) => {
    try {
      const tenants = await TenantService.getAll();
      return reply.send(tenants);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get tenant by slug
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

  // Get tenant by ID
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
  // Update tenant by ID
  fastify.put('/tenants/:id', async (request: any, reply: any) => {
    try {
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
