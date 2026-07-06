export type StatusAgendamento = 'confirmado' | 'concluido' | 'faltou' | 'cancelado';

export interface Agendamento {
  id: string;
  tenantId: string;
  profissionalId: string;
  clienteId?: string;
  servicoId: string;
  dataHora: Date;
  duracaoMinutos?: number;
  status: StatusAgendamento;
  observacoes?: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail?: string;
}
