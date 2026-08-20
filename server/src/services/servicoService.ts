import { Repo } from '../lib/db';

export interface Servico {
  id: string;
  tenantId: string;
  nome: string;
  preco: number;
  duracaoMinutos: number;
  comissaoPercentual?: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const repo = new Repo<Servico>('servicos');

export class ServicoService {
  static getAll(tenantId: string) {
    return repo.findAll(tenantId, 'nome');
  }
  static getById(tenantId: string, id: string) {
    return repo.findById(tenantId, id);
  }
  static create(data: Partial<Servico>) {
    return repo.create(data);
  }
  static update(tenantId: string, id: string, data: Partial<Servico>) {
    return repo.update(tenantId, id, data);
  }
  static softDelete(tenantId: string, id: string) {
    return repo.softDelete(tenantId, id);
  }
}
