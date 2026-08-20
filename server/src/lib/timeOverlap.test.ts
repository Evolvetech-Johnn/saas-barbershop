import { hasOverlap } from './timeOverlap';

const t = (isoOffsetMin: number) => new Date(2026, 0, 1, 10, 0, 0).getTime() + isoOffsetMin * 60000;

describe('hasOverlap', () => {
  it('detecta sobreposição parcial (novo começa durante o existente)', () => {
    expect(hasOverlap({ inicio: t(0), duracaoMinutos: 30 }, { inicio: t(15), duracaoMinutos: 30 })).toBe(true);
  });

  it('detecta um intervalo totalmente contido no outro', () => {
    expect(hasOverlap({ inicio: t(0), duracaoMinutos: 60 }, { inicio: t(10), duracaoMinutos: 10 })).toBe(true);
  });

  it('não detecta conflito quando os horários são adjacentes (um termina quando o outro começa)', () => {
    expect(hasOverlap({ inicio: t(0), duracaoMinutos: 30 }, { inicio: t(30), duracaoMinutos: 30 })).toBe(false);
  });

  it('não detecta conflito quando os horários estão totalmente separados', () => {
    expect(hasOverlap({ inicio: t(0), duracaoMinutos: 30 }, { inicio: t(120), duracaoMinutos: 30 })).toBe(false);
  });

  it('é simétrica (ordem dos argumentos não muda o resultado)', () => {
    const a = { inicio: t(0), duracaoMinutos: 30 };
    const b = { inicio: t(15), duracaoMinutos: 30 };
    expect(hasOverlap(a, b)).toBe(hasOverlap(b, a));
  });
});
