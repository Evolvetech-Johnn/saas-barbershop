import { FastifyReply, FastifyRequest } from 'fastify';

// ponytail: o tenantId nunca deve vir do header x-tenant-id (o cliente pode
// forjar qualquer valor); ele só é confiável depois de extraído do JWT
// assinado pelo servidor. requireAuth popula request.tenantId a partir do
// token verificado e ignora completamente o que veio no header.
export const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // @ts-ignore - fastify-jwt augments request with jwtVerify()
    await (request as any).jwtVerify();
    const payload = (request as any).user || {};
    (request as any).tenantId = payload.tenantId;
    (request as any).userRole = payload.role;
  } catch (err) {
    return (reply as any).code(401).send({ error: 'Unauthorized' });
  }
};

export const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    // @ts-ignore - fastify-jwt augments request with jwtVerify()
    await (request as any).jwtVerify();
    const payload = (request as any).user || {};
    if (payload.role !== 'admin') {
      return (reply as any).code(403).send({ error: 'Forbidden' });
    }
    (request as any).tenantId = payload.tenantId;
    (request as any).userRole = payload.role;
  } catch (err) {
    return (reply as any).code(401).send({ error: 'Unauthorized' });
  }
};
