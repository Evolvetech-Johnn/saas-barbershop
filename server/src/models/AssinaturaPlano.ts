import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssinaturaPlano extends Document {
  tenantId: mongoose.Types.ObjectId;
  clienteId: mongoose.Types.ObjectId;
  planoFidelidadeId: mongoose.Types.ObjectId;
  dataInicio: Date;
  dataFim?: Date;
  status: 'ativo' | 'cancelado';
  createdAt: Date;
  updatedAt: Date;
}

const AssinaturaPlanoSchema: Schema = new Schema<IAssinaturaPlano>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
    planoFidelidadeId: { type: Schema.Types.ObjectId, ref: 'PlanoFidelidade', required: true, index: true },
    dataInicio: { type: Date, required: true, default: Date.now },
    dataFim: { type: Date },
    status: { type: String, required: true, enum: ['ativo', 'cancelado'], default: 'ativo' }
  },
  { timestamps: true, collection: 'assinaturasplanos' }
);

AssinaturaPlanoSchema.index(
  { tenantId: 1, clienteId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'ativo' } }
);
AssinaturaPlanoSchema.index({ tenantId: 1, status: 1 });

const AssinaturaPlano: Model<IAssinaturaPlano> = mongoose.models.AssinaturaPlano || mongoose.model<IAssinaturaPlano>('AssinaturaPlano', AssinaturaPlanoSchema);

export default AssinaturaPlano;
