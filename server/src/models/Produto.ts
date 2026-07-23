import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduto extends Document {
  tenantId: mongoose.Types.ObjectId;
  nome: string;
  categoria: string;
  preco: number;
  custo: number;
  quantidade: number;
  quantidadeMinima: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ProdutoSchema: Schema = new Schema<IProduto>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    nome: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    preco: { type: Number, required: true, min: 0 },
    custo: { type: Number, required: true, min: 0 },
    quantidade: { type: Number, required: true, default: 0, min: 0 },
    quantidadeMinima: { type: Number, required: true, default: 5, min: 0 },
    ativo: { type: Boolean, required: true, default: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'produtos' }
);

ProdutoSchema.index({ tenantId: 1, categoria: 1, ativo: 1 });
ProdutoSchema.index({ deletedAt: 1 });

const Produto: Model<IProduto> = mongoose.models.Produto || mongoose.model<IProduto>('Produto', ProdutoSchema);

export default Produto;
