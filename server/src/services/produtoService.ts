import { Produto, IProduto } from '../models';

export class ProdutoService {
  static async getAll(tenantId: string): Promise<IProduto[]> {
    return Produto.find({ tenantId, deletedAt: null }).sort({ nome: 1 });
  }

  static async getById(tenantId: string, id: string): Promise<IProduto | null> {
    return Produto.findOne({ _id: id, tenantId, deletedAt: null });
  }

  static async create(data: Partial<IProduto>): Promise<IProduto> {
    return Produto.create(data);
  }

  static async update(tenantId: string, id: string, data: Partial<IProduto>): Promise<IProduto | null> {
    return Produto.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async softDelete(tenantId: string, id: string): Promise<IProduto | null> {
    return Produto.findOneAndUpdate({ _id: id, tenantId }, { deletedAt: new Date() }, { new: true });
  }
}
