import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const authRoutes: FastifyPluginAsync = async (fastify, opts) => {
  // Login
  fastify.post('/auth/login', async (request, reply) => {
    // In a real app, validate credentials against DB
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = bodySchema.parse(request.body);
    // Dummy user & tenant
    const user = { id: 'user-1', email, tenantId: request.headers['x-tenant-id'] as string || 'default' };
    const token = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId }, { expiresIn: '1h' });
    const refreshToken = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId }, { expiresIn: '7d' });
    return reply.send({ token, refreshToken, user });
  });

  // Refresh token
  fastify.post('/auth/refresh', async (request, reply) => {
    const bodySchema = z.object({ refreshToken: z.string() });
    const { refreshToken } = bodySchema.parse(request.body);
    try {
      const decoded = fastify.jwt.verify(refreshToken);
      const newToken = fastify.jwt.sign({ sub: decoded.sub, tenantId: decoded.tenantId }, { expiresIn: '1h' });
      return reply.send({ token: newToken });
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });
};

export default authRoutes;
