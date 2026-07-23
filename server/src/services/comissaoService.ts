import { Comissao, IComissao } from '../models';

export class ComissaoService {
  static async getAll(tenantId: string, profissionalId?: string): Promise<IComissao[]> {
    const query: any = { tenantId };
    if (profissionalId) {
      query.profissionalId = profissionalId;
    }
    return Comissao.find(query)
      .populate('profissionalId', 'nome')
      .populate('comandaId')
      .sort({ dataHora: -1 });
  }

  static async create(data: Partial<IComissao>): Promise<IComissao> {
    return Comissao.create(data);
  }

  static async markAsPaid(tenantId: string, comissaoId: string): Promise<IComissao | null> {
    return Comissao.findOneAndUpdate(
      { _id: comissaoId, tenantId },
      { status: 'paga' },
      { new: true }
    );
  }

  static async delete(tenantId: string, comissaoId: string): Promise<boolean> {
    const result = await Comissao.deleteOne({ _id: comissaoId, tenantId });
    return result.deletedCount > 0;
  }
}
