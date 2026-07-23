import { Servico, IServico } from '../models';

export class ServicoService {
  static async getAll(tenantId: string): Promise<IServico[]> {
    return Servico.find({ tenantId, deletedAt: null }).sort({ nome: 1 });
  }

  static async getById(tenantId: string, id: string): Promise<IServico | null> {
    return Servico.findOne({ _id: id, tenantId, deletedAt: null });
  }

  static async create(data: Partial<IServico>): Promise<IServico> {
    return Servico.create(data);
  }

  static async update(tenantId: string, id: string, data: Partial<IServico>): Promise<IServico | null> {
    return Servico.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async softDelete(tenantId: string, id: string): Promise<IServico | null> {
    return Servico.findOneAndUpdate({ _id: id, tenantId }, { deletedAt: new Date() }, { new: true });
  }
}
