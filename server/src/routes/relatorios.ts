import { Agendamento, Comanda, Cliente, Comissao, Produto, Servico } from '../models';

const relatoriosRoutes = async (fastify: any, opts: any) => {
  fastify.get('/relatorios', async (request: any, reply: any) => {
    try {
      const tenantId = request.headers['x-tenant-id'] as string;
      if (!tenantId) {
        return reply.status(400).send({ error: 'Tenant ID is required' });
      }

      const now = new Date();
      const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // --- 1. KPI Metrics (Faturamento Mensal, Clientes Ativos, Agendamentos, Ticket Médio) ---
      
      // Faturamento total do mês atual
      const comandasMes = await Comanda.find({
        tenantId,
        deletedAt: null,
        dataHora: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth }
      });
      const faturamentoTotalMes = comandasMes.reduce((sum, c) => sum + c.total, 0);

      // Total de Clientes Ativos
      const totalClientes = await Cliente.countDocuments({ tenantId, deletedAt: null });

      // Total de Agendamentos (Novas Reservas no mês)
      const agendamentosMes = await Agendamento.countDocuments({
        tenantId,
        createdAt: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth }
      });

      // Ticket Médio
      const ticketMedio = comandasMes.length > 0 ? (faturamentoTotalMes / comandasMes.length) : 0;

      const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

      const kpiMetrics = [
        { label: 'Faturamento Total', value: formatCurrency(faturamentoTotalMes) },
        { label: 'Clientes Ativos', value: totalClientes },
        { label: 'Novas Reservas', value: agendamentosMes },
        { label: 'Ticket Médio', value: formatCurrency(ticketMedio) },
      ];

      // --- 2. Faturamento Mensal (Últimos 6 meses) e 3. Trend de Agendamentos ---
      const revenue = [];
      const monthlyTrend = [];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        
        const monthLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        const comandas = await Comanda.find({
          tenantId,
          deletedAt: null,
          dataHora: { $gte: date, $lt: nextMonth }
        });
        const monthRevenue = comandas.reduce((sum, c) => sum + c.total, 0);
        revenue.push({ month: monthLabel, amount: monthRevenue });

        const agendamentos = await Agendamento.countDocuments({
          tenantId,
          dataHora: { $gte: date, $lt: nextMonth }
        });
        monthlyTrend.push({ month: monthLabel, value: agendamentos });
      }

      // --- 4. Service Breakdown (Agrupar receita por serviço) ---
      const serviceRevenueMap = new Map<string, number>();
      for (const comanda of comandasMes) {
        for (const item of comanda.itens) {
          if (item.tipo === 'servico') {
            const current = serviceRevenueMap.get(item.nome) || 0;
            serviceRevenueMap.set(item.nome, current + (item.precoUnitario * item.quantidade));
          }
        }
      }

      const serviceRevenue = Array.from(serviceRevenueMap.entries())
        .map(([service, rev]) => ({ service, revenue: rev }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5); // top 5

      // --- 5. Commissions (Comissões do mês por profissional) ---
      const comissoesMes = await Comissao.find({
        tenantId,
        dataHora: { $gte: firstDayOfCurrentMonth, $lte: lastDayOfCurrentMonth }
      }).populate('profissionalId');

      const comissoesMap = new Map<string, { name: string, commission: number }>();
      comissoesMes.forEach((comissao: any) => {
        const pId = comissao.profissionalId?._id?.toString() || 'unknown';
        const pName = comissao.profissionalId?.nome || 'Desconhecido';
        const current = comissoesMap.get(pId) || { name: pName, commission: 0 };
        current.commission += comissao.valor;
        comissoesMap.set(pId, current);
      });

      const commissions = Array.from(comissoesMap.entries()).map(([professionalId, data]) => ({
        professionalId,
        name: data.name,
        commission: data.commission
      }));

      // --- 6. Stock Alerts (Produtos com quantidade <= quantidadeMinima) ---
      const stockAlerts = await Produto.find({
        tenantId,
        deletedAt: null,
        $expr: { $lte: ['$quantidade', '$quantidadeMinima'] }
      }).limit(10);

      const formattedStockAlerts = stockAlerts.map(p => ({
        productId: p._id,
        name: p.nome,
        quantity: p.quantidade,
        minQuantity: p.quantidadeMinima
      }));

      return reply.send({
        kpiMetrics,
        revenue,
        monthlyTrend,
        serviceRevenue,
        commissions,
        stockAlerts: formattedStockAlerts
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default relatoriosRoutes;
