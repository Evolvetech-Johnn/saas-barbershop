// fastify.d.ts – augment FastifyRequest with optional tenantId
declare module 'fastify' {
  interface FastifyRequest {
    /**
     * Tenant identifier extracted from the `x-tenant-id` header.
     * Optional because the middleware currently allows requests without a tenant.
     */
    tenantId?: string;
  }
}
