import { Repo } from '../lib/db';

export interface Cliente {
  id: string;
  tenantId: string;
  nome: string;
  telefone: string;
  email?: string;
  dataNascimento?: string;
  observacoes?: string;
  planoFidelidadeId?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const repo = new Repo<Cliente>('clientes');

export class ClienteService {
  static getAll(tenantId: string) {
    return repo.findAll(tenantId, 'nome');
  }
  static getById(tenantId: string, id: string) {
    return repo.findById(tenantId, id);
  }
  static create(data: Partial<Cliente>) {
    return repo.create(data);
  }
  static update(tenantId: string, id: string, data: Partial<Cliente>) {
    return repo.update(tenantId, id, data);
  }
  static softDelete(tenantId: string, id: string) {
    return repo.softDelete(tenantId, id);
  }
}
