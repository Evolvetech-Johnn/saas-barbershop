import { Agendamento, Comanda, Cliente, Profissional } from '../models';

const dashboardRoutes = async (fastify: any, opts: any) => {
  fastify.get('/dashboard', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }

      // 1. Agendamentos Hoje (Agendamentos created for today's date)
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const agendamentosHoje = await Agendamento.find({
        tenantId,
        dataHora: { $gte: startOfToday, $lte: endOfToday }
      })
      .populate('clienteId')
      .populate('profissionalId')
      .populate('servicoId')
      .sort({ dataHora: 1 });

      // 2. Faturamento Hoje (Comandas concluded today)
      const comandasHoje = await Comanda.find({
        tenantId,
        deletedAt: null,
        dataHora: { $gte: startOfToday, $lte: endOfToday }
      });
      const faturamentoHoje = comandasHoje.reduce((sum, c) => sum + c.total, 0);

      // 3. Total de Clientes
      const totalClientes = await Cliente.countDocuments({ tenantId, deletedAt: null });

      // 4. Taxa de Comparecimento
      let taxaComparecimento = 0;
      if (agendamentosHoje.length > 0) {
        const concluidos = agendamentosHoje.filter(a => a.status === 'concluido' || a.status === 'confirmado').length;
        taxaComparecimento = Math.round((concluidos / agendamentosHoje.length) * 100);
      }

      // 5. Faturamento por Dia da Semana (Últimos 7 dias para gráfico)
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
      seteDiasAtras.setHours(0, 0, 0, 0);
      
      const comandasSemana = await Comanda.find({
        tenantId,
        deletedAt: null,
        dataHora: { $gte: seteDiasAtras }
      });

      const faturamentoSemanal: { date: string; amount: number }[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(seteDiasAtras);
        d.setDate(d.getDate() + i);
        const dayString = d.toISOString().split('T')[0];
        faturamentoSemanal.push({ date: dayString, amount: 0 });
      }

      comandasSemana.forEach(c => {
        const dayString = new Date(c.dataHora).toISOString().split('T')[0];
        const index = faturamentoSemanal.findIndex(f => f.date === dayString);
        if (index !== -1) {
          faturamentoSemanal[index].amount += c.total;
        }
      });

      return reply.send({
        agendamentosHoje,
        faturamentoHoje,
        totalClientes,
        taxaComparecimento,
        faturamentoSemanal,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default dashboardRoutes;
