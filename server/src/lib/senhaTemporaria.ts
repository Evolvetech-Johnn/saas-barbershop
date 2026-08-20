export function gerarSenhaTemporaria(): string {
  return Math.random().toString(36).slice(-10);
}
