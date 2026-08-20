import { z } from 'zod';
import { UsuarioService } from '../services/usuarioService';

const authRoutes = async (fastify: any, opts: any) => {
  // Login
  fastify.post('/auth/login', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (request: any, reply: any) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = bodySchema.parse(request.body);

    const tenantId = request.headers['x-tenant-id'] as string;
    if (!tenantId) {
      return reply.status(400).send({ error: 'Tenant ID is required' });
    }

    const usuario = await UsuarioService.getByEmail(tenantId, email);
    if (!usuario) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isValid = await UsuarioService.compareSenha(password, usuario.senhaHash);
    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    if (!usuario.ativo) {
      return reply.status(403).send({ error: 'User is inactive' });
    }

    const user = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      tenantId: usuario.tenantId,
      papel: usuario.papel,
      fotoUrl: usuario.fotoUrl,
    };

    const token = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.papel }, { expiresIn: '1h' });
    const refreshToken = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.papel }, { expiresIn: '7d' });
    return reply.send({ token, refreshToken, user });
  });

  // Login do superadmin da plataforma — não é escopado por tenant, por isso
  // não exige x-tenant-id como o /auth/login normal.
  fastify.post('/auth/admin-login', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, async (request: any, reply: any) => {
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = bodySchema.parse(request.body);

    const usuario = await UsuarioService.getAdminByEmail(email);
    if (!usuario) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isValid = await UsuarioService.compareSenha(password, usuario.senhaHash);
    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    if (!usuario.ativo) {
      return reply.status(403).send({ error: 'User is inactive' });
    }

    const user = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      tenantId: usuario.tenantId,
      papel: usuario.papel,
      fotoUrl: usuario.fotoUrl,
    };

    const token = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.papel }, { expiresIn: '1h' });
    const refreshToken = fastify.jwt.sign({ sub: user.id, tenantId: user.tenantId, role: user.papel }, { expiresIn: '7d' });
    return reply.send({ token, refreshToken, user });
  });

  // Refresh token
  fastify.post('/auth/refresh', async (request: any, reply: any) => {
    const bodySchema = z.object({ refreshToken: z.string() });
    const { refreshToken } = bodySchema.parse(request.body);
    try {
      const decoded: any = fastify.jwt.verify(refreshToken);
      const usuario = await UsuarioService.getByIdAnyTenant(decoded.sub);
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
