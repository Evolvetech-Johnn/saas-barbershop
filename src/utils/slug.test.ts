import { describe, it, expect } from 'vitest';
import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('remove acentos e coloca em minúsculo', () => {
    expect(generateSlug('Barbearia São José')).toBe('barbearia-sao-jose');
  });
  it('troca espaços e caracteres especiais por hífen único', () => {
    expect(generateSlug('Corte & Barba!!')).toBe('corte-barba');
  });
  it('não deixa hífen sobrando no início/fim', () => {
    expect(generateSlug('  Esquina  ')).toBe('esquina');
  });
});
