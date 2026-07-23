import mongoose, { Schema, Document, Model } from 'mongoose';

export type StatusAgendamento = 'confirmado' | 'concluido' | 'faltou' | 'cancelado';

export interface IAgendamento extends Document {
  tenantId: mongoose.Types.ObjectId;
  profissionalId: mongoose.Types.ObjectId;
  clienteId?: mongoose.Types.ObjectId;
  servicoId: mongoose.Types.ObjectId;
  dataHora: Date;
  duracaoMinutos: number;
  status: StatusAgendamento;
  observacoes?: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const AgendamentoSchema: Schema = new Schema<IAgendamento>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    profissionalId: { type: Schema.Types.ObjectId, ref: 'Profissional', required: true, index: true },
    clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', index: true },
    servicoId: { type: Schema.Types.ObjectId, ref: 'Servico', required: true, index: true },
    dataHora: { type: Date, required: true, index: true },
    duracaoMinutos: { type: Number, required: true, default: 30, min: 1 },
    status: { type: String, required: true, enum: ['confirmado', 'concluido', 'faltou', 'cancelado'], default: 'confirmado' },
    observacoes: { type: String, trim: true },
    clienteNome: { type: String, required: true, trim: true },
    clienteTelefone: { type: String, required: true, trim: true },
    clienteEmail: { type: String, trim: true, lowercase: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Usuario', index: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'agendamentos' }
);

AgendamentoSchema.index(
  { tenantId: 1, profissionalId: 1, dataHora: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);
AgendamentoSchema.index({ tenantId: 1, status: 1, dataHora: 1 });
AgendamentoSchema.index({ deletedAt: 1 });

const Agendamento: Model<IAgendamento> = mongoose.models.Agendamento || mongoose.model<IAgendamento>('Agendamento', AgendamentoSchema);

export default Agendamento;
