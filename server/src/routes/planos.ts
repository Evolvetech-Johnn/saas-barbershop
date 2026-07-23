import { PlanoFidelidade, AssinaturaPlano, Cliente } from '../models';

const planosRoutes = async (fastify: any, opts: any) => {
  // Get all Planos Fidelidade
  fastify.get('/planos', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const planos = await PlanoFidelidade.find({ tenantId, deletedAt: null }).sort({ precoMensal: 1 });
      return reply.send(planos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Get Assinaturas
  fastify.get('/assinaturas', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      const assinaturas = await AssinaturaPlano.find({ tenantId, status: 'ativo' })
        .populate('clienteId', 'nome email telefone')
        .populate('planoFidelidadeId', 'nome precoMensal beneficios')
        .sort({ dataInicio: -1 });
      return reply.send(assinaturas);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Assinar Cliente
  fastify.post('/assinaturas', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      
      const { clienteId, planoFidelidadeId } = request.body;
      
      // Ensure only one active subscription per user
      const existing = await AssinaturaPlano.findOne({ tenantId, clienteId, status: 'ativo' });
      if (existing) {
        return reply.status(400).send({ error: 'Cliente já possui uma assinatura ativa.' });
      }

      const assinatura = await AssinaturaPlano.create({
        tenantId,
        clienteId,
        planoFidelidadeId,
        status: 'ativo'
      });

      return reply.status(201).send(assinatura);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Cancelar assinatura
  fastify.patch('/assinaturas/:id/cancelar', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }
      
      const id = request.params.id;
      const assinatura = await AssinaturaPlano.findOneAndUpdate(
        { _id: id, tenantId },
        { status: 'cancelado', dataFim: new Date() },
        { new: true }
      );
      
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
