import { ProdutoService } from '../services/produtoService';
import { requireAuth } from '../middlewares/authMiddleware';

const produtosRoutes = async (fastify: any, opts: any) => {
  fastify.get('/produtos', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const produtos = await ProdutoService.getAll(request.tenantId);
      return reply.send(produtos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/produtos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const produto = await ProdutoService.getById(request.tenantId, request.params.id);
      if (!produto) {
        return reply.status(404).send({ error: 'Produto not found' });
      }
      return reply.send(produto);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/produtos', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const novo = await ProdutoService.create({ ...request.body, tenantId: request.tenantId });
      return reply.status(201).send(novo);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.put('/produtos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const atualizado = await ProdutoService.update(request.tenantId, request.params.id, request.body);
      if (!atualizado) {
        return reply.status(404).send({ error: 'Produto not found' });
      }
      return reply.send(atualizado);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete('/produtos/:id', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const deletado = await ProdutoService.softDelete(request.tenantId, request.params.id);
      if (!deletado) {
        return reply.status(404).send({ error: 'Produto not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/produtos/bulk', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const produtos = request.body;
      const criados = await Promise.all(produtos.map((p: any) => ProdutoService.create({ ...p, tenantId: request.tenantId })));
      return reply.status(201).send(criados);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default produtosRoutes;
