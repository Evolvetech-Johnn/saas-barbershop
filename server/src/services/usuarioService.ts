import { Usuario, IUsuario } from '../models';

export class UsuarioService {
  static async getAll(tenantId: string): Promise<IUsuario[]> {
    return Usuario.find({ tenantId, deletedAt: null }).sort({ createdAt: -1 });
  }

  static async getById(tenantId: string, id: string): Promise<IUsuario | null> {
    return Usuario.findOne({ _id: id, tenantId, deletedAt: null });
  }

  static async getByEmail(tenantId: string, email: string): Promise<IUsuario | null> {
    return Usuario.findOne({ email, tenantId, deletedAt: null });
  }

  static async create(data: Partial<IUsuario>): Promise<IUsuario> {
    return Usuario.create(data);
  }

  static async update(tenantId: string, id: string, data: Partial<IUsuario>): Promise<IUsuario | null> {
    return Usuario.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async softDelete(tenantId: string, id: string): Promise<IUsuario | null> {
    return Usuario.findOneAndUpdate({ _id: id, tenantId }, { deletedAt: new Date() }, { new: true });
  }
}
