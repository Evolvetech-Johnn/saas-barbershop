import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComissao extends Document {
  tenantId: mongoose.Types.ObjectId;
  comandaId: mongoose.Types.ObjectId;
  profissionalId: mongoose.Types.ObjectId;
  valor: number;
  percentual: number;
  status: 'pendente' | 'paga';
  dataHora: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComissaoSchema: Schema = new Schema<IComissao>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    comandaId: { type: Schema.Types.ObjectId, ref: 'Comanda', required: true, index: true },
    profissionalId: { type: Schema.Types.ObjectId, ref: 'Profissional', required: true, index: true },
    valor: { type: Number, required: true, min: 0 },
    percentual: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: ['pendente', 'paga'], default: 'pendente', required: true },
    dataHora: { type: Date, required: true, default: Date.now, index: true }
  },
  { timestamps: true, collection: 'comissoes' }
);

ComissaoSchema.index({ tenantId: 1, profissionalId: 1, dataHora: 1 });

const Comissao: Model<IComissao> = mongoose.models.Comissao || mongoose.model<IComissao>('Comissao', ComissaoSchema);

export default Comissao;
