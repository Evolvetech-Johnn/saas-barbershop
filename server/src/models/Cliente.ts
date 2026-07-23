import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICliente extends Document {
  tenantId: mongoose.Types.ObjectId;
  nome: string;
  telefone: string;
  email?: string;
  dataNascimento?: Date;
  observacoes?: string;
  planoFidelidadeId?: mongoose.Types.ObjectId;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ClienteSchema: Schema = new Schema<ICliente>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dataNascimento: { type: Date },
    observacoes: { type: String, trim: true },
    planoFidelidadeId: { type: Schema.Types.ObjectId, ref: 'PlanoFidelidade', index: true },
    ativo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'clientes' }
);

ClienteSchema.index({ tenantId: 1, telefone: 1 });
ClienteSchema.index({ tenantId: 1, ativo: 1 });
ClienteSchema.index({ deletedAt: 1 });

const Cliente: Model<ICliente> = mongoose.models.Cliente || mongoose.model<ICliente>('Cliente', ClienteSchema);

export default Cliente;
