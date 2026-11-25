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

import { requirePlatformAdmin } from './authMiddleware';

describe('requirePlatformAdmin (escalada: admin de barbearia != admin da plataforma)', () => {
  it('rejeita 403 admin de barbearia comum (sem claim platform)', async () => {
    const request = makeRequest({ jwtOk: true, user: { tenantId: 'barbearia-x', role: 'admin' } });
    const reply = makeReply();
    await requirePlatformAdmin(request, reply);
    expect(reply.code).toHaveBeenCalledWith(403);
  });
  it('rejeita 403 quando platform não é exatamente true', async () => {
    for (const platform of ['true', 1, 'yes']) {
      const reply = makeReply();
      await requirePlatformAdmin(makeRequest({ jwtOk: true, user: { tenantId: 't', role: 'admin', platform } }), reply);
      expect(reply.code).toHaveBeenCalledWith(403);
    }
  });
  it('rejeita 403 platform sem papel admin', async () => {
    const reply = makeReply();
    await requirePlatformAdmin(makeRequest({ jwtOk: true, user: { tenantId: 't', role: 'profissional', platform: true } }), reply);
    expect(reply.code).toHaveBeenCalledWith(403);
  });
  it('rejeita 401 sem token válido', async () => {
    const reply = makeReply();
    await requirePlatformAdmin(makeRequest({ jwtOk: false }), reply);
    expect(reply.code).toHaveBeenCalledWith(401);
  });
  it('libera o admin da plataforma', async () => {
    const request = makeRequest({ jwtOk: true, user: { tenantId: 'plat', role: 'admin', platform: true } });
    const reply = makeReply();
    await requirePlatformAdmin(request, reply);
    expect(reply.code).not.toHaveBeenCalled();
    expect(request.tenantId).toBe('plat');
  });
});
