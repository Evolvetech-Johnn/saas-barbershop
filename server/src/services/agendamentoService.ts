import { Agendamento, IAgendamento } from '../models';

export class AgendamentoService {
  static async getAll(tenantId: string, startDate?: string, endDate?: string): Promise<IAgendamento[]> {
    const query: any = { tenantId, deletedAt: null };
    
    if (startDate && endDate) {
      query.dataHora = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    return Agendamento.find(query)
      .populate('clienteId', 'nome telefone')
      .populate('profissionalId', 'nome')
      .populate('servicoId', 'nome duracao preco')
      .sort({ dataHora: 1 });
  }

  static async getById(tenantId: string, id: string): Promise<IAgendamento | null> {
    return Agendamento.findOne({ _id: id, tenantId, deletedAt: null })
      .populate('clienteId')
      .populate('profissionalId')
      .populate('servicoId');
  }

  static async checkConflict(tenantId: string, profissionalId: string, dataHora: Date, duracaoMinutos: number, excludeId?: string): Promise<boolean> {
    const start = new Date(dataHora);
    const end = new Date(start.getTime() + duracaoMinutos * 60000);

    const query: any = {
      tenantId,
      profissionalId,
      deletedAt: null,
      status: { $in: ['confirmado'] },
      $or: [
        // Starts during the new appointment
        { dataHora: { $gte: start, $lt: end } },
        // Ends during the new appointment (we need the existing duracaoMinutos, which is tricky in a simple find without aggregation, 
        // but for now let's just check if the start time of existing is less than our end time, 
        // AND its end time is greater than our start time)
      ]
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    // A more precise overlap query:
    // Existing start < New end AND Existing end > New start
    // Since MongoDB doesn't easily let us query computed fields (Existing end = dataHora + duracaoMinutos) in a basic find,
    // we can fetch all appointments for that professional on that day and do the math in JS.
    
    const dayStart = new Date(start);
    dayStart.setHours(0,0,0,0);
    const dayEnd = new Date(start);
    dayEnd.setHours(23,59,59,999);

    const dailyAppointments = await Agendamento.find({
      tenantId,
      profissionalId,
      deletedAt: null,
      status: { $in: ['confirmado'] },
      dataHora: { $gte: dayStart, $lte: dayEnd },
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    });

    for (const appt of dailyAppointments) {
      const apptStart = new Date(appt.dataHora).getTime();
      const apptEnd = apptStart + (appt.duracaoMinutos * 60000);
      const newStart = start.getTime();
      const newEnd = end.getTime();

      if (apptStart < newEnd && apptEnd > newStart) {
        return true; // Conflict found
      }
    }

    return false; // No conflict
  }

  static async create(data: Partial<IAgendamento>): Promise<IAgendamento> {
    // Conflict check is expected to be handled by the route or here
    if (data.tenantId && data.profissionalId && data.dataHora && data.duracaoMinutos) {
      const conflict = await this.checkConflict(
        data.tenantId.toString(),
        data.profissionalId.toString(),
        data.dataHora,
        data.duracaoMinutos
      );
      if (conflict) {
        throw new Error('Horário conflitante para este profissional.');
      }
    }
    return Agendamento.create(data);
  }

  static async update(tenantId: string, id: string, data: Partial<IAgendamento>): Promise<IAgendamento | null> {
    if (data.profissionalId && data.dataHora && data.duracaoMinutos) {
      const conflict = await this.checkConflict(
        tenantId,
        data.profissionalId.toString(),
        data.dataHora,
        data.duracaoMinutos,
        id
      );
      if (conflict) {
        throw new Error('Horário conflitante para este profissional.');
      }
    }
    return Agendamento.findOneAndUpdate({ _id: id, tenantId }, data, { new: true });
  }

  static async softDelete(tenantId: string, id: string): Promise<IAgendamento | null> {
    return Agendamento.findOneAndUpdate({ _id: id, tenantId }, { deletedAt: new Date(), status: 'cancelado' }, { new: true });
  }
}
