// Erros de negócio cuja mensagem PODE ir ao cliente. Qualquer outro erro (banco, Stripe,
// bug) é logado no servidor e o cliente recebe só uma mensagem genérica.
export class AppError extends Error {
  constructor(message: string, public status: number = 400) {
    super(message);
    this.name = 'AppError';
  }
}

export const GENERIC_ERROR = 'Erro interno. Tente novamente em instantes.';

export function errorResponse(error: unknown): { status: number; body: { error: string } } {
  if (error instanceof AppError) return { status: error.status, body: { error: error.message } };
  const name = (error as any)?.name;
  if (name === 'ZodError') return { status: 400, body: { error: 'Dados inválidos.' } };
  return { status: 500, body: { error: GENERIC_ERROR } };
}

/** Use no catch das rotas: `return sendError(reply, error)`. */
export function sendError(reply: any, error: unknown) {
  const { status, body } = errorResponse(error);
  if (status >= 500) reply.log?.error({ err: error }, 'erro interno em rota');
  return reply.status(status).send(body);
}
