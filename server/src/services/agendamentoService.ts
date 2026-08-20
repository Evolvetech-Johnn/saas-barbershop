import { supabase } from '../lib/supabase';
import { rowToCamel, dataToSnake } from '../lib/db';
import { hasOverlap } from '../lib/timeOverlap';

export type StatusAgendamento = 'confirmado' | 'concluido' | 'faltou' | 'cancelado';

export interface Agendamento {
  id: string;
  tenantId: string;
  profissionalId: string;
  clienteId?: string;
  servicoId: string;
  dataHora: string;
  duracaoMinutos: number;
  status: StatusAgendamento;
  observacoes?: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const SELECT_COM_RELACOES = '*, cliente:clientes(nome,telefone), profissional:profissionais(nome), servico:servicos(nome,duracao_minutos,preco)';

// ponytail: expediente fixo (09h-19h, slots de 30min) — não existe configuração
// de horário de funcionamento por tenant ainda. Upgrade: ler de um campo
// horarioFuncionamento estruturado quando isso virar um problema real.
const EXPEDIENTE_INICIO_HORA = 9;
const EXPEDIENTE_FIM_HORA = 19;
const INTERVALO_SLOT_MINUTOS = 30;

function mapRow(row: any) {
  const base = rowToCamel<Agendamento>(row);
  return {
    ...base,
    cliente: row.cliente ? rowToCamel(row.cliente) : null,
    profissional: row.profissional ? rowToCamel(row.profissional) : null,
    servico: row.servico ? rowToCamel(row.servico) : null,
  };
}

export class AgendamentoService {
  static async getAll(tenantId: string, startDate?: string, endDate?: string) {
    let q = supabase.from('agendamentos').select(SELECT_COM_RELACOES).eq('tenant_id', tenantId).is('deleted_at', null);
    if (startDate && endDate) q = q.gte('data_hora', startDate).lte('data_hora', endDate);
    const { data, error } = await q.order('data_hora', { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []).map(mapRow);
  }

  static async getById(tenantId: string, id: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(SELECT_COM_RELACOES)
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data) : null;
  }

  static async checkConflict(
    tenantId: string,
    profissionalId: string,
    dataHora: string,
    duracaoMinutos: number,
    excludeId?: string
  ): Promise<boolean> {
    const start = new Date(dataHora);
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(start);
    dayEnd.setHours(23, 59, 59, 999);

    let q = supabase
      .from('agendamentos')
      .select('id, data_hora, duracao_minutos')
      .eq('tenant_id', tenantId)
      .eq('profissional_id', profissionalId)
      .is('deleted_at', null)
      .eq('status', 'confirmado')
      .gte('data_hora', dayStart.toISOString())
      .lte('data_hora', dayEnd.toISOString());
    if (excludeId) q = q.neq('id', excludeId);

    const { data, error } = await q;
    if (error) throw new Error(error.message);

    return (data || []).some((appt: any) =>
      hasOverlap({ inicio: new Date(appt.data_hora).getTime(), duracaoMinutos: appt.duracao_minutos }, { inicio: start.getTime(), duracaoMinutos })
    );
  }

  /** Slots realmente livres pro profissional naquele dia, já descontando os agendamentos existentes. */
  static async getHorariosDisponiveis(tenantId: string, profissionalId: string, dataISO: string, duracaoMinutos: number): Promise<string[]> {
    const dia = new Date(`${dataISO}T00:00:00`);
    const dayStart = new Date(dia);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dia);
    dayEnd.setHours(23, 59, 59, 999);

    const { data: ocupadosRaw, error } = await supabase
      .from('agendamentos')
      .select('data_hora, duracao_minutos')
      .eq('tenant_id', tenantId)
      .eq('profissional_id', profissionalId)
      .is('deleted_at', null)
      .eq('status', 'confirmado')
      .gte('data_hora', dayStart.toISOString())
      .lte('data_hora', dayEnd.toISOString());
    if (error) throw new Error(error.message);

    const ocupados = (ocupadosRaw || []).map((a: any) => ({ inicio: new Date(a.data_hora).getTime(), duracaoMinutos: a.duracao_minutos }));
    const fimExpediente = new Date(dia);
    fimExpediente.setHours(EXPEDIENTE_FIM_HORA, 0, 0, 0);

    const slots: string[] = [];
    for (let h = EXPEDIENTE_INICIO_HORA; h < EXPEDIENTE_FIM_HORA; h++) {
      for (let m = 0; m < 60; m += INTERVALO_SLOT_MINUTOS) {
        const candidato = new Date(dia);
        candidato.setHours(h, m, 0, 0);
        if (candidato.getTime() < Date.now()) continue;
        if (candidato.getTime() + duracaoMinutos * 60000 > fimExpediente.getTime()) continue;

        const conflita = ocupados.some((o) => hasOverlap(o, { inicio: candidato.getTime(), duracaoMinutos }));
        if (!conflita) slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }
    return slots;
  }

  static async create(data: Partial<Agendamento>) {
    if (data.tenantId && data.profissionalId && data.dataHora && data.duracaoMinutos) {
      const conflict = await this.checkConflict(data.tenantId, data.profissionalId, data.dataHora, data.duracaoMinutos);
      if (conflict) throw new Error('Horário conflitante para este profissional.');
    }
    const { data: row, error } = await supabase.from('agendamentos').insert(dataToSnake(data)).select().single();
    if (error) throw new Error(error.message);
    return rowToCamel<Agendamento>(row);
  }

  static async update(tenantId: string, id: string, data: Partial<Agendamento>) {
    if (data.profissionalId && data.dataHora && data.duracaoMinutos) {
      const conflict = await this.checkConflict(tenantId, data.profissionalId, data.dataHora, data.duracaoMinutos, id);
      if (conflict) throw new Error('Horário conflitante para este profissional.');
    }
    const { data: row, error } = await supabase
      .from('agendamentos')
      .update(dataToSnake(data))
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<Agendamento>(row) : null;
  }

  static async softDelete(tenantId: string, id: string) {
    const { data: row, error } = await supabase
      .from('agendamentos')
      .update({ deleted_at: new Date().toISOString(), status: 'cancelado' })
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToCamel<Agendamento>(row) : null;
  }
}
