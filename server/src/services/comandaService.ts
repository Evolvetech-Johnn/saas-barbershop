import { Comanda, IComanda, Agendamento, Comissao } from '../models';

export class ComandaService {
  static async getAll(tenantId: string): Promise<IComanda[]> {
    return Comanda.find({ tenantId, deletedAt: null })
      .populate('agendamentoId')
      .populate('clienteId')
      .populate('profissionalId')
      .sort({ dataHora: -1 });
  }

  static async getById(tenantId: string, id: string): Promise<IComanda | null> {
    return Comanda.findOne({ _id: id, tenantId, deletedAt: null })
      .populate('agendamentoId')
      .populate('clienteId')
      .populate('profissionalId');
  }

  static async create(data: Partial<IComanda>): Promise<IComanda> {
    const session = await Comanda.startSession();
    let novaComanda;
    try {
      session.startTransaction();
      
      novaComanda = await Comanda.create([data], { session });
      const createdComanda = novaComanda[0];
      
      // Se tiver profissional e um total válido, cria a comissão de 50%
      if (createdComanda.profissionalId && createdComanda.total > 0 && createdComanda.tenantId) {
         await Comissao.create([{
           tenantId: createdComanda.tenantId,
           comandaId: createdComanda._id,
           profissionalId: createdComanda.profissionalId,
           percentual: 50,
           valor: createdComanda.total * 0.5,
           status: 'pendente'
         }], { session });
      }

      // If linked to an Agendamento, mark it as concluido
      if (data.agendamentoId && data.tenantId) {
        await Agendamento.findOneAndUpdate(
          { _id: data.agendamentoId, tenantId: data.tenantId },
          { status: 'concluido' },
          { session }
        );
      }
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
    
    return novaComanda[0];
  }

  static async update(tenantId: string, id: string, data: Partial<IComanda>): Promise<IComanda | null> {
    return Comanda.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async softDelete(tenantId: string, id: string): Promise<IComanda | null> {
    // Should probably handle reverting the Agendamento status, but for simplicity we just delete
    return Comanda.findOneAndUpdate({ _id: id, tenantId }, { deletedAt: new Date() }, { new: true });
  }
}
