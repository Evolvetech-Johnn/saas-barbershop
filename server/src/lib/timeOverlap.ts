export interface Intervalo {
  inicio: number;
  duracaoMinutos: number;
}

/** true se os dois intervalos de tempo se sobrepõem em qualquer ponto. */
export function hasOverlap(a: Intervalo, b: Intervalo): boolean {
  const aFim = a.inicio + a.duracaoMinutos * 60000;
  const bFim = b.inicio + b.duracaoMinutos * 60000;
  return a.inicio < bFim && aFim > b.inicio;
}
