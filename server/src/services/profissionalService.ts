import { Profissional, IProfissional } from '../models';

export class ProfissionalService {
  static async getAll(tenantId: string): Promise<IProfissional[]> {
    return Profissional.find({ tenantId, deletedAt: null }).sort({ nome: 1 });
  }

  static async getById(tenantId: string, id: string): Promise<IProfissional | null> {
    return Profissional.findOne({ _id: id, tenantId, deletedAt: null });
  }

  static async create(data: Partial<IProfissional>): Promise<IProfissional> {
    return Profissional.create(data);
  }

  static async update(tenantId: string, id: string, data: Partial<IProfissional>): Promise<IProfissional | null> {
    return Profissional.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async softDelete(tenantId: string, id: string): Promise<IProfissional | null> {
    return Profissional.findOneAndUpdate({ _id: id, tenantId }, { deletedAt: new Date() }, { new: true });
  }
}
