import { FastifyReply, FastifyRequest } from 'fastify';

// Centralized authorization helper for Fastify routes.
// Usage: import { verifyPermissao } from './middlewares/authMiddleware' and use as preHandler
export const verifyPermissao = (allowedRoles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify JWT and populate request.user
      // @ts-ignore - fastify-jwt augments request with jwtVerify()
      await (request as any).jwtVerify();
      // After verification, payload is available on request.user
      const payload = (request as any).user || {};
      const role = payload.role || 'cliente';

      if (!allowedRoles.includes(role)) {
        return (reply as any).code(403).send({ error: 'Forbidden' });
      }
      // authorized
    } catch (err) {
      return (reply as any).code(401).send({ error: 'Unauthorized' });
    }
  };
};

export default verifyPermissao;
