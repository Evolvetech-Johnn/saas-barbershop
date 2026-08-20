import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateRequired } from './validators';

describe('validateEmail', () => {
  it('aceita e-mails válidos', () => {
    expect(validateEmail('admin@barbearia.com')).toBe(true);
  });
  it('rejeita e-mails sem @ ou domínio', () => {
    expect(validateEmail('admin')).toBe(false);
    expect(validateEmail('admin@')).toBe(false);
    expect(validateEmail('admin@barbearia')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('aceita telefones com DDD e formatação comum', () => {
    expect(validatePhone('(11) 98765-4321')).toBe(true);
    expect(validatePhone('11987654321')).toBe(true);
  });
  it('rejeita strings muito curtas', () => {
    expect(validatePhone('123')).toBe(false);
  });
});

describe('validateRequired', () => {
  it('rejeita string vazia ou só espaços', () => {
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('   ')).toBe(false);
  });
  it('aceita texto com conteúdo real', () => {
    expect(validateRequired('Barbearia Classic')).toBe(true);
  });
});
