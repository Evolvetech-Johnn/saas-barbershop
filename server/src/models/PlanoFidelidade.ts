import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlanoFidelidade extends Document {
  tenantId: mongoose.Types.ObjectId;
  nome: string;
  descricao: string;
  precoMensal: number;
  beneficios: string[];
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const PlanoFidelidadeSchema: Schema = new Schema<IPlanoFidelidade>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    precoMensal: { type: Number, required: true, min: 0 },
    beneficios: { type: [String], default: [] },
    ativo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'planosfidelidades' }
);

PlanoFidelidadeSchema.index({ tenantId: 1, ativo: 1 });
PlanoFidelidadeSchema.index({ deletedAt: 1 });

const PlanoFidelidade: Model<IPlanoFidelidade> = mongoose.models.PlanoFidelidade || mongoose.model<IPlanoFidelidade>('PlanoFidelidade', PlanoFidelidadeSchema);

export default PlanoFidelidade;
