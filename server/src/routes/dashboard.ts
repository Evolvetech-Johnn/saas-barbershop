import { supabase } from '../lib/supabase';
import { rowToCamel } from '../lib/db';
import { requireAuth } from '../middlewares/authMiddleware';

const dashboardRoutes = async (fastify: any, opts: any) => {
  fastify.get('/dashboard', { preHandler: requireAuth }, async (request: any, reply: any) => {
    try {
      const tenantId = request.tenantId;

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      // 1. Agendamentos Hoje
      const { data: agHojeRaw, error: agHojeErr } = await supabase
        .from('agendamentos')
        .select('*, cliente:clientes(nome,telefone), profissional:profissionais(nome), servico:servicos(nome,duracao_minutos,preco)')
        .eq('tenant_id', tenantId)
        .gte('data_hora', startOfToday.toISOString())
        .lte('data_hora', endOfToday.toISOString())
        .order('data_hora', { ascending: true });
      if (agHojeErr) throw new Error(agHojeErr.message);
      const agendamentosHoje = (agHojeRaw || []).map((row: any) => ({
        ...rowToCamel(row),
        cliente: row.cliente ? rowToCamel(row.cliente) : null,
        profissional: row.profissional ? rowToCamel(row.profissional) : null,
        servico: row.servico ? rowToCamel(row.servico) : null,
      }));

      // 2. Faturamento Hoje
      const { data: comandasHoje, error: comHojeErr } = await supabase
        .from('comandas')
        .select('total')
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .gte('data_hora', startOfToday.toISOString())
        .lte('data_hora', endOfToday.toISOString());
      if (comHojeErr) throw new Error(comHojeErr.message);
      const faturamentoHoje = (comandasHoje || []).reduce((sum, c) => sum + Number(c.total), 0);

      // 3. Total de Clientes
      const { count: totalClientes, error: clientesErr } = await supabase
        .from('clientes')
        .select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .is('deleted_at', null);
      if (clientesErr) throw new Error(clientesErr.message);

      // 4. Taxa de Comparecimento
      let taxaComparecimento = 0;
      if (agendamentosHoje.length > 0) {
        const concluidos = agendamentosHoje.filter((a: any) => a.status === 'concluido' || a.status === 'confirmado').length;
        taxaComparecimento = Math.round((concluidos / agendamentosHoje.length) * 100);
      }

      // 5. Faturamento por Dia da Semana (últimos 7 dias)
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 6);
      seteDiasAtras.setHours(0, 0, 0, 0);

      const { data: comandasSemana, error: semanaErr } = await supabase
        .from('comandas')
        .select('data_hora, total')
        .eq('tenant_id', tenantId)
        .is('deleted_at', null)
        .gte('data_hora', seteDiasAtras.toISOString());
      if (semanaErr) throw new Error(semanaErr.message);

      const faturamentoSemanal: { date: string; amount: number }[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(seteDiasAtras);
        d.setDate(d.getDate() + i);
        faturamentoSemanal.push({ date: d.toISOString().split('T')[0], amount: 0 });
      }
      (comandasSemana || []).forEach((c) => {
        const dayString = new Date(c.data_hora).toISOString().split('T')[0];
        const idx = faturamentoSemanal.findIndex((f) => f.date === dayString);
        if (idx !== -1) faturamentoSemanal[idx].amount += Number(c.total);
      });

      return reply.send({
        agendamentosHoje,
        faturamentoHoje,
        totalClientes: totalClientes || 0,
        taxaComparecimento,
        faturamentoSemanal,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default dashboardRoutes;
