import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServico extends Document {
  tenantId: mongoose.Types.ObjectId;
  nome: string;
  preco: number;
  duracaoMinutos: number;
  comissaoPercentual?: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ServicoSchema: Schema = new Schema<IServico>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    preco: { type: Number, required: true, min: 0 },
    duracaoMinutos: { type: Number, required: true, default: 30, min: 1 },
    comissaoPercentual: { type: Number, min: 0, max: 100 },
    ativo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'servicos' }
);

ServicoSchema.index({ tenantId: 1, ativo: 1 });
ServicoSchema.index({ deletedAt: 1 });

const Servico: Model<IServico> = mongoose.models.Servico || mongoose.model<IServico>('Servico', ServicoSchema);

export default Servico;
