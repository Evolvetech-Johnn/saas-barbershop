import { Cliente, ICliente } from '../models';

export class ClienteService {
  static async getAll(tenantId: string): Promise<ICliente[]> {
    return Cliente.find({ tenantId, deletedAt: null }).sort({ nome: 1 });
  }

  static async getById(tenantId: string, id: string): Promise<ICliente | null> {
    return Cliente.findOne({ _id: id, tenantId, deletedAt: null });
  }

  static async create(data: Partial<ICliente>): Promise<ICliente> {
    return Cliente.create(data);
  }

  static async update(tenantId: string, id: string, data: Partial<ICliente>): Promise<ICliente | null> {
    return Cliente.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async softDelete(tenantId: string, id: string): Promise<ICliente | null> {
    return Cliente.findOneAndUpdate({ _id: id, tenantId }, { deletedAt: new Date() }, { new: true });
  }
}
