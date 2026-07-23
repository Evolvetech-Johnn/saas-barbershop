import { Tenant, ITenant } from '../models';

export class TenantService {
  static async getAll(): Promise<ITenant[]> {
    return Tenant.find({ deletedAt: null }).sort({ createdAt: -1 });
  }

  static async getById(id: string): Promise<ITenant | null> {
    return Tenant.findOne({ _id: id, deletedAt: null });
  }

  static async getBySlug(slug: string): Promise<ITenant | null> {
    return Tenant.findOne({ slug, deletedAt: null });
  }

  static async create(data: Partial<ITenant>): Promise<ITenant> {
    return Tenant.create(data);
  }

  static async update(id: string, data: Partial<ITenant>): Promise<ITenant | null> {
    return Tenant.findByIdAndUpdate(id, data, { new: true });
  }

  static async softDelete(id: string): Promise<ITenant | null> {
    return Tenant.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
}
