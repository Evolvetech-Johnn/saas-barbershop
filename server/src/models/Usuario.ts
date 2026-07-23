import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUsuario extends Document {
  tenantId: mongoose.Types.ObjectId;
  email: string;
  senhaHash: string;
  nome: string;
  papel: 'admin' | 'profissional' | 'recepcao' | 'cliente';
  ativo: boolean;
  fotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  compareSenha(senha: string): Promise<boolean>;
}

const UsuarioSchema: Schema = new Schema<IUsuario>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    senhaHash: { type: String, required: true },
    nome: { type: String, required: true, trim: true },
    papel: { type: String, required: true, enum: ['admin', 'profissional', 'recepcao', 'cliente'], default: 'cliente' },
    ativo: { type: Boolean, required: true, default: true },
    fotoUrl: { type: String, trim: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'usuarios' }
);

UsuarioSchema.index({ tenantId: 1, email: 1 }, { unique: true });
UsuarioSchema.index({ tenantId: 1, papel: 1, ativo: 1 });
UsuarioSchema.index({ deletedAt: 1 });

UsuarioSchema.pre('save', async function () {
  if (!this.isModified('senhaHash')) return;
  const salt = await bcrypt.genSalt(12);
  this.senhaHash = await bcrypt.hash(this.senhaHash as string, salt);
});

UsuarioSchema.methods.compareSenha = async function (senha: string): Promise<boolean> {
  return bcrypt.compare(senha, this.senhaHash as string);
};

const Usuario: Model<IUsuario> = mongoose.models.Usuario || mongoose.model<IUsuario>('Usuario', UsuarioSchema);

export default Usuario;
