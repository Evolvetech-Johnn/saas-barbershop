import { z } from 'zod';
import { Usuario } from '../models';

const authRoutes = async (fastify: any, opts: any) => {
  // Login
  fastify.post('/auth/login', async (request: any, reply: any) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = bodySchema.parse(request.body);

    const tenantId = request.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return reply.status(400).send({ error: 'Tenant ID is required' });
    }

    const usuario = await Usuario.findOne({ email, tenantId, deletedAt: null });
    if (!usuario) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isValid = await usuario.compareSenha(password);
    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    if (!usuario.ativo) {
      return reply.status(403).send({ error: 'User is inactive' });
    }

    const user = {
      id: usuario._id,
      email: usuario.email,
      nome: usuario.nome,
      tenantId: usuario.tenantId,
      role: usuario.papel,
      fotoUrl: usuario.fotoUrl
    };

    const token = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.role }, { expiresIn: '1h' });
    const refreshToken = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.role }, { expiresIn: '7d' });
    return reply.send({ token, refreshToken, user });
  });

  // Refresh token
  fastify.post('/auth/refresh', async (request: any, reply: any) => {
    const bodySchema = z.object({ refreshToken: z.string() });
    const { refreshToken } = bodySchema.parse(request.body);
    try {
      const decoded: any = fastify.jwt.verify(refreshToken);
      const usuario = await Usuario.findById(decoded.sub);
      if (!usuario) {
        return reply.status(401).send({ error: 'Invalid user' });
      }
      const newToken = fastify.jwt.sign({ sub: decoded.sub, tenantId: decoded.tenantId, role: decoded.role }, { expiresIn: '1h' });
      return reply.send({ token: newToken });
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });
};

export default authRoutes;
