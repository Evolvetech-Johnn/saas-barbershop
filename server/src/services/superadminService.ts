import bcrypt from 'bcrypt';
import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';
import { isReservedSlug } from '../lib/reservedSlugs';
import { gerarSenhaTemporaria } from '../lib/senhaTemporaria';

export interface PlanoSaas {
  id: string;
  codigo: 'start' | 'pro' | 'premium';
  nome: string;
  preco: number;
  limiteProfissionais: number | null;
  limiteServicos: number | null;
  limiteClientes: number | null;
  recursos: string[];
  ativo: boolean;
  stripePriceId?: string | null;
}

export class SuperadminService {
  /** Lista tenants com estatísticas reais de uso (contagens + faturamento do mês). */
  static async getTenantsComEstatisticas() {
    const { data: tenants, error } = await supabase.from('tenants').select('*').is('deleted_at', null).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const results = await Promise.all(
      (tenants || []).map(async (t) => {
        const [{ count: clientesCadastrados }, { count: profissionaisCadastrados }, { count: agendamentosRealizados }, { data: comandasMes }, { data: adminUsuario }] =
          await Promise.all([
            supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id).is('deleted_at', null),
            supabase.from('profissionais').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id).is('deleted_at', null),
            supabase.from('agendamentos').select('id', { count: 'exact', head: true }).eq('tenant_id', t.id),
            supabase.from('comandas').select('total').eq('tenant_id', t.id).is('deleted_at', null).gte('data_hora', firstDayMonth),
            supabase.from('usuarios').select('email').eq('tenant_id', t.id).eq('papel', 'admin').is('deleted_at', null).limit(1).maybeSingle(),
          ]);

        const faturamentoMensal = (comandasMes || []).reduce((sum, c) => sum + Number(c.total), 0);

        return {
          ...rowToCamel(t),
          clientesCadastrados: clientesCadastrados || 0,
          profissionaisCadastrados: profissionaisCadastrados || 0,
          agendamentosRealizados: agendamentosRealizados || 0,
          faturamentoMensal,
          contatoEmail: adminUsuario?.email || null,
          contatoTelefone: t.telefone || null,
        };
      })
    );

    return results;
  }

  /** Cria o tenant e já cria o usuário admin dele, para a barbearia conseguir logar de imediato. */
  static async createTenant(data: { nome: string; slug: string; planoSaas: string; email?: string; telefone?: string }) {
    if (isReservedSlug(data.slug)) {
      throw new Error(`O slug "${data.slug}" é reservado pelo sistema. Escolha outro.`);
    }

    const { data: tenant, error } = await supabase
      .from('tenants')
      .insert({
        nome: data.nome,
        slug: data.slug,
        plano_saas: data.planoSaas,
        status: 'ativo',
        telefone: data.telefone,
        data_vencimento_plano: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    let senhaTemporaria: string | undefined;
    if (data.email) {
      senhaTemporaria = gerarSenhaTemporaria();
      const senhaHash = await bcrypt.hash(senhaTemporaria, 12);
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({ tenant_id: tenant.id, email: data.email, senha_hash: senhaHash, nome: 'Administrador', papel: 'admin', ativo: true });
      if (usuarioError) throw new Error(usuarioError.message);
    }

    return { ...rowToCamel(tenant), senhaTemporaria };
  }

  static async setTenantStatus(id: string, status: 'ativo' | 'inativo') {
    const { data, error } = await supabase.from('tenants').update({ status }).eq('id', id).select().maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel(data) : null;
  }

  /** Catálogo de planos SaaS com contagem real de assinantes por plano. */
  static async getPlanos(): Promise<(PlanoSaas & { totalAssinantes: number })[]> {
    const [{ data: planos, error: planosErr }, { data: tenants, error: tenantsErr }] = await Promise.all([
      supabase.from('planos_saas').select('*').order('preco', { ascending: true }),
      supabase.from('tenants').select('plano_saas').is('deleted_at', null).eq('status', 'ativo'),
    ]);
    if (planosErr) throw new Error(planosErr.message);
    if (tenantsErr) throw new Error(tenantsErr.message);

    const contagem = new Map<string, number>();
    (tenants || []).forEach((t) => contagem.set(t.plano_saas, (contagem.get(t.plano_saas) || 0) + 1));

    return (planos || []).map((p) => ({ ...rowToCamel<PlanoSaas>(p), totalAssinantes: contagem.get(p.codigo) || 0 }));
  }

  static async updatePlano(id: string, data: Partial<PlanoSaas>) {
    const { data: row, error } = await supabase.from('planos_saas').update(dataToSnake(data)).eq('id', id).select().maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel(row) : null;
  }

  /** Faturas reais de billing (populadas pelos webhooks da Stripe quando integrado). */
  static async getFaturas() {
    const { data, error } = await supabase
      .from('faturas')
      .select('*, tenant:tenants(nome)')
      .order('vencimento', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row: any) => ({ ...rowToCamel(row), tenant: row.tenant ? rowToCamel(row.tenant) : null }));
  }

  static async marcarFaturaPaga(id: string) {
    const { data, error } = await supabase
      .from('faturas')
      .update({ status: 'paga', pago_em: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToCamel(data) : null;
  }

  // ponytail: sem histórico de billing real ainda (Stripe não integrado), então o
  // MRR de meses passados é aproximado pelo plano ATUAL de cada tenant criado até
  // aquele mês, não pelo plano que ele tinha de fato na época. Upgrade: ler de
  // `faturas` quando a Stripe estiver alimentando a tabela com histórico real.
  static async getReceitaTrend() {
    const [{ data: tenants, error: tenantsErr }, { data: planos, error: planosErr }] = await Promise.all([
      supabase.from('tenants').select('plano_saas,status,data_criacao').is('deleted_at', null),
      supabase.from('planos_saas').select('codigo,preco'),
    ]);
    if (tenantsErr) throw new Error(tenantsErr.message);
    if (planosErr) throw new Error(planosErr.message);

    const precoPorPlano = new Map((planos || []).map((p) => [p.codigo, Number(p.preco)]));
    const now = new Date();
    const trend: { month: string; mrr: number; newSignups: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;

      const ativosNoMes = (tenants || []).filter((t) => new Date(t.data_criacao) <= monthEnd && t.status === 'ativo');
      const mrr = ativosNoMes.reduce((sum, t) => sum + (precoPorPlano.get(t.plano_saas) || 0), 0);
      const newSignups = (tenants || []).filter((t) => {
        const d = new Date(t.data_criacao);
        return d >= monthStart && d <= monthEnd;
      }).length;

      trend.push({ month: monthLabel, mrr, newSignups });
    }

    return trend;
  }
}
