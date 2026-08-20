import { Repo } from '../lib/db';

export interface Produto {
  id: string;
  tenantId: string;
  nome: string;
  categoria: string;
  preco: number;
  custo: number;
  quantidade: number;
  quantidadeMinima: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

const repo = new Repo<Produto>('produtos');

export class ProdutoService {
  static getAll(tenantId: string) {
    return repo.findAll(tenantId, 'nome');
  }
  static getById(tenantId: string, id: string) {
    return repo.findById(tenantId, id);
  }
  static create(data: Partial<Produto>) {
    return repo.create(data);
  }
  static update(tenantId: string, id: string, data: Partial<Produto>) {
    return repo.update(tenantId, id, data);
  }
  static softDelete(tenantId: string, id: string) {
    return repo.softDelete(tenantId, id);
  }
}
