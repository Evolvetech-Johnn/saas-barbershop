import fastifyJwt from '@fastify/jwt';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyAutoload from '@fastify/autoload';
import path from 'path';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from './config/database';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

  // Use a require import here to avoid TypeScript issues with Fastify's callable type in this project setup.
  // This keeps runtime behavior intact while avoiding a compile-time mismatch with the installed types.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Fastify: any = require('fastify');
  const server = Fastify({ logger: true });

async function bootstrap() {
  try {
    // Connect to MongoDB before starting the server
    await connectDatabase();

    // Register plugins
    await server.register(fastifyCors, {
      origin: '*', // adjust in production
    });
    await server.register(fastifyHelmet);
    await server.register(fastifyJwt, {
      secret: process.env.JWT_PRIVATE_KEY || 'supersecret',
    });

    // Tenant extraction middleware
    server.addHook('preHandler', async (request, reply) => {
      // Example: tenantId from subdomain header "x-tenant-id"
      const tenantId = request.headers['x-tenant-id'] as string | undefined;
      if (tenantId) {
        // @ts-ignore attach to request
        request.tenantId = tenantId;
      } else {
        // For now allow without tenant; in production enforce
        request.tenantId = undefined;
      }
    });

    // Autoload routes from src/routes
    await server.register(fastifyAutoload, {
      dir: path.join(__dirname, 'routes'),
      options: { prefix: '/api' },
    });

    // Health check
    server.get('/api/health', async (req, reply) => {
      return { status: 'ok' };
    });

    await server.listen({ port: Number(process.env.PORT) || 3001, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    await disconnectDatabase();
    process.exit(1);
  }
}

bootstrap();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[APP] SIGTERM received, shutting down gracefully');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('[APP] SIGINT received, shutting down gracefully');
  await disconnectDatabase();
  process.exit(0);
});
