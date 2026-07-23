import { ProdutoService } from '../services/produtoService';
import { z } from 'zod';

const produtosRoutes = async (fastify: any, opts: any) => {
  // Get all
  fastify.get('/produtos', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const produtos = await ProdutoService.getAll(tenantId);
      return reply.send(produtos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get by ID
  fastify.get('/produtos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const produto = await ProdutoService.getById(tenantId, request.params.id);
      if (!produto) {
        return reply.status(404).send({ error: 'Produto not found' });
      }
      return reply.send(produto);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Create
  fastify.post('/produtos', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const novo = await ProdutoService.create({ ...request.body, tenantId });
      return reply.status(201).send(novo);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Update
  fastify.put('/produtos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const atualizado = await ProdutoService.update(tenantId, request.params.id, request.body);
      if (!atualizado) {
        return reply.status(404).send({ error: 'Produto not found' });
      }
      return reply.send(atualizado);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Delete
  fastify.delete('/produtos/:id', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const deletado = await ProdutoService.softDelete(tenantId, request.params.id);
      if (!deletado) {
        return reply.status(404).send({ error: 'Produto not found' });
      }
      return reply.send({ success: true });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Bulk Create
  fastify.post('/produtos/bulk', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const produtos = request.body;
      const criados = await Promise.all(produtos.map((p: any) => ProdutoService.create({ ...p, tenantId })));
      return reply.status(201).send(criados);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default produtosRoutes;
