import mongoose, { Schema, Document, Model } from 'mongoose';

export type FormaPagamento = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito';

export interface IItemComanda {
  tipo: 'servico' | 'produto';
  itemId: mongoose.Types.ObjectId;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface IComanda extends Document {
  tenantId: mongoose.Types.ObjectId;
  agendamentoId?: mongoose.Types.ObjectId;
  clienteId?: mongoose.Types.ObjectId;
  profissionalId: mongoose.Types.ObjectId;
  itens: IItemComanda[];
  formaPagamento: FormaPagamento;
  desconto: number;
  total: number;
  dataHora: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ItemComandaSchema: Schema = new Schema<IItemComanda>(
  {
    tipo: { type: String, required: true, enum: ['servico', 'produto'] },
    itemId: { type: Schema.Types.ObjectId, required: true },
    nome: { type: String, required: true, trim: true },
    quantidade: { type: Number, required: true, default: 1, min: 1 },
    precoUnitario: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const ComandaSchema: Schema = new Schema<IComanda>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    agendamentoId: { type: Schema.Types.ObjectId, ref: 'Agendamento', index: true },
    clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', index: true },
    profissionalId: { type: Schema.Types.ObjectId, ref: 'Profissional', required: true, index: true },
    itens: { type: [ItemComandaSchema], required: true },
    formaPagamento: { type: String, required: true, enum: ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito'] },
    desconto: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    dataHora: { type: Date, required: true, default: Date.now, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Usuario', index: true },
    deletedAt: { type: Date }
  },
  { timestamps: true, collection: 'comandas' }
);

ComandaSchema.index({ tenantId: 1, dataHora: 1 });
ComandaSchema.index({ tenantId: 1, profissionalId: 1, dataHora: 1 });
ComandaSchema.index({ deletedAt: 1 });

const Comanda: Model<IComanda> = mongoose.models.Comanda || mongoose.model<IComanda>('Comanda', ComandaSchema);

export default Comanda;
