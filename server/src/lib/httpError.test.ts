import { AppError, errorResponse, sendError, GENERIC_ERROR } from './httpError';

describe('errorResponse', () => {
  it('mostra a mensagem só de AppError, com o status dele', () => {
    expect(errorResponse(new AppError('Horário conflitante.', 409))).toEqual({ status: 409, body: { error: 'Horário conflitante.' } });
  });
  it('esconde mensagem de erro de banco/Stripe/bug', () => {
    const r = errorResponse(new Error('duplicate key value violates unique constraint "clientes_email_key"'));
    expect(r.status).toBe(500);
    expect(r.body.error).toBe(GENERIC_ERROR);
    expect(JSON.stringify(r)).not.toContain('constraint');
  });
  it('ZodError vira 400 sem detalhes internos', () => {
    const e: any = new Error('[{"path":["email"]}]');
    e.name = 'ZodError';
    expect(errorResponse(e)).toEqual({ status: 400, body: { error: 'Dados inválidos.' } });
  });
});

describe('sendError', () => {
  it('loga no servidor erro 5xx e responde genérico', () => {
    const reply: any = { log: { error: jest.fn() } };
    reply.status = jest.fn().mockReturnValue(reply);
    reply.send = jest.fn().mockReturnValue(reply);
    sendError(reply, new Error('segredo interno'));
    expect(reply.log.error).toHaveBeenCalled();
    expect(reply.status).toHaveBeenCalledWith(500);
    expect(reply.send).toHaveBeenCalledWith({ error: GENERIC_ERROR });
  });
});
