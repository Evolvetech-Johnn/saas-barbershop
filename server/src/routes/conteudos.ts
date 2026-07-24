import { ConteudoPublicoService } from '../services/conteudoPublicoService';

const conteudosRoutes = async (fastify: any, opts: any) => {
  fastify.get('/conteudos', async (request: any, reply: any) => {
    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return reply.status(400).send({ message: 'Header x-tenant-id é obrigatório' });
    }

    try {
      const conteudos = await ConteudoPublicoService.getAtivos(tenantId);
      return reply.send(conteudos);
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar conteúdos' });
    }
  });

  // Outras rotas CRUD seriam adicionadas aqui futuramente
};

export default conteudosRoutes;
