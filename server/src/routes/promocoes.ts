import { PromocaoService } from '../services/promocaoService';

const promocoesRoutes = async (fastify: any, opts: any) => {
  fastify.get('/promocoes', async (request: any, reply: any) => {
    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return reply.status(400).send({ message: 'Header x-tenant-id é obrigatório' });
    }

    try {
      const promocoes = await PromocaoService.getAtivas(tenantId);
      return reply.send(promocoes);
    } catch (error) {
      return reply.status(500).send({ message: 'Erro ao buscar promoções' });
    }
  });

  // Outras rotas CRUD (POST, PUT, DELETE) seriam adicionadas aqui futuramente
};

export default promocoesRoutes;
