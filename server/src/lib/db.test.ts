import { rowToCamel, dataToSnake } from './db';

describe('rowToCamel', () => {
  it('converte chaves snake_case do Postgres para camelCase', () => {
    expect(rowToCamel({ tenant_id: '1', preco_mensal: 49.9, nome: 'Plano' })).toEqual({
      tenantId: '1',
      precoMensal: 49.9,
      nome: 'Plano',
    });
  });

  it('preserva valores nulos e arrays sem tocar no conteúdo', () => {
    expect(rowToCamel({ deleted_at: null, beneficios: ['a', 'b'] })).toEqual({ deletedAt: null, beneficios: ['a', 'b'] });
  });
});

describe('dataToSnake', () => {
  it('converte chaves camelCase para snake_case', () => {
    expect(dataToSnake({ tenantId: '1', precoMensal: 49.9 })).toEqual({ tenant_id: '1', preco_mensal: 49.9 });
  });

  it('descarta chaves com valor undefined (update parcial não deve sobrescrever com null)', () => {
    expect(dataToSnake({ nome: 'X', ativo: undefined })).toEqual({ nome: 'X' });
  });

  it('é o inverso de rowToCamel para um objeto simples', () => {
    const original = { tenant_id: '1', duracao_minutos: 30 };
    expect(dataToSnake(rowToCamel(original))).toEqual(original);
  });
});
