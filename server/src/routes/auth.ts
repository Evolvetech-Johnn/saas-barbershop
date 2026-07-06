import { z } from 'zod';

const authRoutes = async (fastify: any, opts: any) => {
  // Login
  fastify.post('/auth/login', async (request, reply) => {
    // In a real app, validate credentials against DB
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = bodySchema.parse(request.body);
    // Dummy user & tenant. In real app retrieve user from DB and include role from user record.
    const tenantId = request.headers['x-tenant-id'] as string || 'default';
    // Default role should be 'cliente' unless DB/user record indicates otherwise. For demo, accept admin@saas.com as admin.
    const role = (email === 'admin@saas.com' && password === 'admin123') ? 'admin' : 'cliente';
    const user = { id: 'user-1', email, tenantId, role };

    // Include role in the JWT payload so backend and frontend can rely on it for authorization decisions.
    const token = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.role }, { expiresIn: '1h' });
    const refreshToken = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.role }, { expiresIn: '7d' });
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
