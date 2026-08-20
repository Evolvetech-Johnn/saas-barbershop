import { requireAuth, requireAdmin } from './authMiddleware';

function makeRequest(overrides: { jwtOk: boolean; user?: any }) {
  return {
    jwtVerify: overrides.jwtOk ? async () => {} : async () => { throw new Error('invalid token'); },
    user: overrides.user,
  } as any;
}

function makeReply() {
  const reply: any = {};
  reply.code = jest.fn().mockReturnValue(reply);
  reply.send = jest.fn().mockReturnValue(reply);
  return reply;
}

describe('requireAuth', () => {
  it('rejeita com 401 quando o token é inválido/ausente', async () => {
    const request = makeRequest({ jwtOk: false });
    const reply = makeReply();
    await requireAuth(request, reply);
    expect(reply.code).toHaveBeenCalledWith(401);
  });

  it('deriva tenantId do payload do JWT, nunca de um header', async () => {
    const request = makeRequest({ jwtOk: true, user: { tenantId: 'tenant-real', role: 'admin' } });
    (request as any).headers = { 'x-tenant-id': 'tenant-forjado' };
    const reply = makeReply();
    await requireAuth(request, reply);
    expect(request.tenantId).toBe('tenant-real');
    expect(reply.code).not.toHaveBeenCalled();
  });
});

describe('requireAdmin', () => {
  it('rejeita com 403 quando o usuário autenticado não é admin', async () => {
    const request = makeRequest({ jwtOk: true, user: { tenantId: 't1', role: 'profissional' } });
    const reply = makeReply();
    await requireAdmin(request, reply);
    expect(reply.code).toHaveBeenCalledWith(403);
  });

  it('libera quando o papel é admin', async () => {
    const request = makeRequest({ jwtOk: true, user: { tenantId: 't1', role: 'admin' } });
    const reply = makeReply();
    await requireAdmin(request, reply);
    expect(reply.code).not.toHaveBeenCalled();
    expect(request.tenantId).toBe('t1');
  });
});
