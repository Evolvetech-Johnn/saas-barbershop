import { Repo } from '../lib/db';

export interface PlanoFidelidade {
  id: string;
  tenantId: string;
  nome: string;
  descricao: string;
  precoMensal: number;
  beneficios: string[];
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const repo = new Repo<PlanoFidelidade>('planos_fidelidade');

export class PlanoFidelidadeService {
  static getAll(tenantId: string) {
    return repo.findAll(tenantId, 'preco_mensal');
  }
  static getById(tenantId: string, id: string) {
    return repo.findById(tenantId, id);
  }
  static create(data: Partial<PlanoFidelidade>) {
    return repo.create(data);
  }
  static update(tenantId: string, id: string, data: Partial<PlanoFidelidade>) {
    return repo.update(tenantId, id, data);
  }
  static softDelete(tenantId: string, id: string) {
    return repo.softDelete(tenantId, id);
  }
}
