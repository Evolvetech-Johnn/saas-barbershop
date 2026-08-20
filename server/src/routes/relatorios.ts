import { supabase } from '../lib/supabase';
import { requireAuth } from '../middlewares/authMiddleware';

const relatoriosRoutes = async (fastify: any, opts: any) => {
  fastify.get('/relatorios', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const tenantId = request.tenantId;

      const now = new Date();
      const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // --- 1. KPI Metrics ---
      const { data: comandasMes, error: comandasMesErr } = await supabase
        .from('comandas')
        .select('*, itens:comanda_itens(*)')
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .gte('data_hora', firstDayOfCurrentMonth.toISOString())
        .lte('data_hora', lastDayOfCurrentMonth.toISOString());
      if (comandasMesErr) throw new Error(comandasMesErr.message);
      const faturamentoTotalMes = (comandasMes || []).reduce((sum, c) => sum + Number(c.total), 0);

      const { count: totalClientes, error: clientesErr } = await supabase
        .from('clientes')
        .select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .is('deleted_at', null);
      if (clientesErr) throw new Error(clientesErr.message);

      const { count: agendamentosMes, error: agMesErr } = await supabase
        .from('agendamentos')
        .select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .gte('created_at', firstDayOfCurrentMonth.toISOString())
        .lte('created_at', lastDayOfCurrentMonth.toISOString());
      if (agMesErr) throw new Error(agMesErr.message);

      const ticketMedio = (comandasMes || []).length > 0 ? faturamentoTotalMes / comandasMes!.length : 0;
      const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

      const kpiMetrics = [
        { label: 'Faturamento Total', value: formatCurrency(faturamentoTotalMes) },
        { label: 'Clientes Ativos', value: totalClientes || 0 },
        { label: 'Novas Reservas', value: agendamentosMes || 0 },
        { label: 'Ticket Médio', value: formatCurrency(ticketMedio) },
      ];

      // --- 2. Faturamento Mensal (6 meses) e 3. Trend de Agendamentos ---
      const revenue: { month: string; amount: number }[] = [];
      const monthlyTrend: { month: string; value: number }[] = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        const monthLabel = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        const { data: comandas, error: cErr } = await supabase
          .from('comandas')
          .select('total')
          .eq('tenant_id', tenantId)
          .is('deleted_at', null)
          .gte('data_hora', date.toISOString())
          .lt('data_hora', nextMonth.toISOString());
        if (cErr) throw new Error(cErr.message);
        revenue.push({ month: monthLabel, amount: (comandas || []).reduce((sum, c) => sum + Number(c.total), 0) });

        const { count: agCount, error: agErr } = await supabase
          .from('agendamentos')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId)
          .gte('data_hora', date.toISOString())
          .lt('data_hora', nextMonth.toISOString());
        if (agErr) throw new Error(agErr.message);
        monthlyTrend.push({ month: monthLabel, value: agCount || 0 });
      }

      // --- 4. Service Breakdown ---
      const serviceRevenueMap = new Map<string, number>();
      for (const comanda of comandasMes || []) {
        for (const item of (comanda as any).itens || []) {
          if (item.tipo === 'servico') {
            const current = serviceRevenueMap.get(item.nome) || 0;
            serviceRevenueMap.set(item.nome, current + Number(item.preco_unitario) * Number(item.quantidade));
          }
        }
      }
      const serviceRevenue = Array.from(serviceRevenueMap.entries())
        .map(([service, rev]) => ({ service, revenue: rev }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // --- 5. Commissions ---
      const { data: comissoesMes, error: comissoesErr } = await supabase
        .from('comissoes')
        .select('valor, profissional:profissionais(id,nome)')
        .eq('tenant_id', tenantId)
        .gte('data_hora', firstDayOfCurrentMonth.toISOString())
        .lte('data_hora', lastDayOfCurrentMonth.toISOString());
      if (comissoesErr) throw new Error(comissoesErr.message);

      const comissoesMap = new Map<string, { name: string; commission: number }>();
      (comissoesMes || []).forEach((c: any) => {
        const pId = c.profissional?.id || 'unknown';
        const pName = c.profissional?.nome || 'Desconhecido';
        const current = comissoesMap.get(pId) || { name: pName, commission: 0 };
        current.commission += Number(c.valor);
        comissoesMap.set(pId, current);
      });
      const commissions = Array.from(comissoesMap.entries()).map(([professionalId, data]) => ({ professionalId, ...data }));

      // --- 6. Stock Alerts ---
      const { data: produtos, error: produtosErr } = await supabase
        .from('produtos')
        .select('id,nome,quantidade,quantidade_minima')
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .limit(200);
      if (produtosErr) throw new Error(produtosErr.message);
      const formattedStockAlerts = (produtos || [])
        .filter((p) => p.quantidade <= p.quantidade_minima)
        .slice(0, 10)
        .map((p) => ({ productId: p.id, name: p.nome, quantity: p.quantidade, minQuantity: p.quantidade_minima }));

      return reply.send({
        kpiMetrics,
        revenue,
        monthlyTrend,
        serviceRevenue,
        commissions,
        stockAlerts: formattedStockAlerts,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default relatoriosRoutes;
