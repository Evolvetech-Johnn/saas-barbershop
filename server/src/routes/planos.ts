import { PlanoFidelidadeService } from '../services/planoFidelidadeService';
import { AssinaturaFidelidadeService } from '../services/assinaturaFidelidadeService';
import { requireAuth } from '../middlewares/authMiddleware';

const planosRoutes = async (fastify: any, opts: any) => {
  // Get all Planos Fidelidade
  fastify.get('/planos', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const planos = await PlanoFidelidadeService.getAll(request.tenantId);
      return reply.send(planos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get Assinaturas
  fastify.get('/assinaturas', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const assinaturas = await AssinaturaFidelidadeService.getAtivas(request.tenantId);
      return reply.send(assinaturas);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Assinar Cliente
  fastify.post('/assinaturas', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const { clienteId, planoFidelidadeId } = request.body;
      const assinatura = await AssinaturaFidelidadeService.assinar(request.tenantId, clienteId, planoFidelidadeId);
      return reply.status(201).send(assinatura);
    } catch (error: any) {
      if (error.message.includes('já possui')) {
        return reply.status(400).send({ error: error.message });
      }
      return reply.status(500).send({ error: error.message });
    }
  });

  // Cancelar assinatura
  fastify.patch('/assinaturas/:id/cancelar', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const assinatura = await AssinaturaFidelidadeService.cancelar(request.tenantId, request.params.id);
      if (!assinatura) {
        return reply.status(404).send({ error: 'Assinatura não encontrada' });
      }
      return reply.send(assinatura);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default planosRoutes;
