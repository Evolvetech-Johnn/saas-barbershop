import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITenant extends Document {
  slug: string;
  nome: string;
  logoUrl?: string;
  corAcento: string;
  planoSaas: 'start' | 'pro' | 'premium';
  status: 'ativo' | 'inativo' | 'vencido';
  dataCriacao: Date;
  dataVencimentoPlano: Date;
  descricaoPublica?: string;
  endereco?: string;
  telefone?: string;
  horarioFuncionamento?: string;
  imagensGaleria?: string[];
  onboardingConcluido?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const TenantSchema: Schema = new Schema<ITenant>(
  {
    slug: { type: String, required: true, trim: true, lowercase: true },
    nome: { type: String, required: true, trim: true },
    logoUrl: { type: String, trim: true },
    corAcento: { type: String, required: true, default: '#3b82f6', trim: true },
    planoSaas: { type: String, required: true, enum: ['start', 'pro', 'premium'], default: 'start' },
    status: { type: String, required: true, enum: ['ativo', 'inativo', 'vencido'], default: 'ativo' },
    dataCriacao: { type: Date, required: true, default: Date.now },
    dataVencimentoPlano: { type: Date, required: true },
    descricaoPublica: { type: String, trim: true },
    endereco: { type: String, trim: true },
    telefone: { type: String, trim: true },
    horarioFuncionamento: { type: String, trim: true },
    imagensGaleria: { type: [String], default: [] },
    onboardingConcluido: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'tenants' }
);

TenantSchema.index({ slug: 1 }, { unique: true });
TenantSchema.index({ status: 1, planoSaas: 1 });
TenantSchema.index({ deletedAt: 1 });

const Tenant: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);

export default Tenant;
