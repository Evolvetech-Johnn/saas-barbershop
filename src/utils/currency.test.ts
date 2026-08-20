import { describe, it, expect } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
  it('formata em Real brasileiro com duas casas decimais', () => {
    expect(formatCurrency(49.9)).toBe('R$ 49,90');
  });
  it('formata zero corretamente', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });
});
