import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProfissional extends Document {
  tenantId: mongoose.Types.ObjectId;
  usuarioId?: mongoose.Types.ObjectId;
  nome: string;
  especialidade: string[];
  cor: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ProfissionalSchema: Schema = new Schema<IProfissional>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', index: true },
    nome: { type: String, required: true, trim: true },
    especialidade: { type: [String], default: [] },
    cor: { type: String, required: true, default: '#6366f1', trim: true },
    ativo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'profissionais' }
);

ProfissionalSchema.index({ tenantId: 1, ativo: 1 });
ProfissionalSchema.index({ deletedAt: 1 });

const Profissional: Model<IProfissional> = mongoose.models.Profissional || mongoose.model<IProfissional>('Profissional', ProfissionalSchema);

export default Profissional;
