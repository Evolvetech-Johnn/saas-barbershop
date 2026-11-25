// Testes-guarda: leem o código-fonte e travam regras do CLAUDE.md.
// Se falhar, corrija o código. Só amplie as listas abaixo se a rota for REALMENTE pública.
import fs from 'fs';
import path from 'path';

const SRC = __dirname;
const ROUTES = path.join(SRC, 'routes');

const read = (f: string) => fs.readFileSync(f, 'utf8');
function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.ts') && !p.endsWith('.test.ts') ? [p] : [];
  });
}

// Rotas sem sessão que existem hoje (vitrine, agendamento público, login, webhook).
// Rota nova que não esteja aqui precisa de preHandler requireAuth/requireAdmin.
const PUBLIC_ROUTES = new Set([
  'agendamentos.ts GET /agendamentos/disponibilidade',
  'agendamentos.ts POST /agendamentos',
  'auth.ts POST /auth/login',
  'auth.ts POST /auth/admin-login',
  'auth.ts POST /auth/refresh',
  'conteudos.ts GET /conteudos',
  'profissionais.ts GET /profissionais',
  'profissionais.ts GET /profissionais/:id',
  'promocoes.ts GET /promocoes',
  'servicos.ts GET /servicos',
  'servicos.ts GET /servicos/:id',
  'stripe.ts POST /stripe/webhook',
  'tenants.ts GET /tenants',
  'tenants.ts GET /tenants/slug/:slug',
  'tenants.ts GET /tenants/:id',
]);

// Arquivos que podem ler x-tenant-id (rotas públicas identificadas pelo slug).
const MAY_READ_TENANT_HEADER = new Set([
  'agendamentos.ts', 'auth.ts', 'conteudos.ts', 'profissionais.ts', 'promocoes.ts', 'servicos.ts',
]);

describe('arquitetura do backend', () => {
  const routeFiles = walk(ROUTES);

  it('toda rota é protegida por requireAuth/requireAdmin ou está na lista de públicas', () => {
    const offenders: string[] = [];
    const re = /fastify\.(get|post|put|patch|delete)\(\s*['"`]([^'"`]+)['"`]([\s\S]*?)async\s*\(/g;
    for (const file of routeFiles) {
      const src = read(file);
      let m: RegExpExecArray | null;
      while ((m = re.exec(src))) {
        const key = `${path.basename(file)} ${m[1].toUpperCase()} ${m[2]}`;
        const protectedRoute = /preHandler:\s*(requireAuth|requireAdmin|requirePlatformAdmin)/.test(m[3]);
        if (!protectedRoute && !PUBLIC_ROUTES.has(key)) offenders.push(key);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('a lista de públicas não guarda rota que já foi removida', () => {
    const existing = new Set<string>();
    const re = /fastify\.(get|post|put|patch|delete)\(\s*['"`]([^'"`]+)['"`]/g;
    for (const file of routeFiles) {
      let m: RegExpExecArray | null;
      const src = read(file);
      while ((m = re.exec(src))) existing.add(`${path.basename(file)} ${m[1].toUpperCase()} ${m[2]}`);
    }
    expect([...PUBLIC_ROUTES].filter((k) => !existing.has(k))).toEqual([]);
  });

  it('x-tenant-id só é lido em rotas públicas conhecidas', () => {
    const offenders = routeFiles
      .filter((f) => /x-tenant-id/.test(read(f)) && !MAY_READ_TENANT_HEADER.has(path.basename(f)))
      .map((f) => path.basename(f));
    expect(offenders).toEqual([]);
  });

  it('não há fallback de segredo no código', () => {
    const offenders = walk(SRC)
      .filter((f) => !f.endsWith('architecture.test.ts') && !f.endsWith('env.ts'))
      .filter((f) => /\|\|\s*['"](supersecret|changeme|secret)['"]/i.test(read(f)))
      .map((f) => path.relative(SRC, f));
    expect(offenders).toEqual([]);
  });

  it('a trava de slugs reservados continua existindo e bloqueia admin/app/styleguide', () => {
    const src = read(path.join(SRC, 'lib', 'reservedSlugs.ts'));
    for (const s of ['admin', 'app', 'styleguide']) expect(src).toContain(`'${s}'`);
  });
});

describe('superadmin', () => {
  it('toda rota /superadmin que muda ou lista dados da plataforma usa requirePlatformAdmin', () => {
    const src = read(path.join(ROUTES, 'superadmin.ts'));
    expect(src).not.toMatch(/preHandler:\s*requireAdmin/);
    // única exceção conhecida: catálogo de planos (leitura), usado por qualquer tenant logado
    const lines = src.split('\n').filter((l) => /fastify\.\w+\('\/superadmin/.test(l) && /preHandler:\s*requireAuth/.test(l));
    expect(lines.map((l) => l.trim().split("'")[1])).toEqual(['/superadmin/planos']);
  });
  it('admin-login não busca admin em qualquer tenant', () => {
    expect(read(path.join(ROUTES, 'auth.ts'))).not.toContain('getAdminByEmail');
  });
});

describe('tenants públicos', () => {
  it('rotas de tenants nunca devolvem o registro bruto', () => {
    const src = read(path.join(ROUTES, 'tenants.ts'));
    expect(src).not.toMatch(/reply\.send\(tenants?\)/);
    expect(src).not.toMatch(/TenantService\.update\([^,]+,\s*request\.body/);
  });
});

describe('vazamento de erro interno', () => {
  it('nenhuma rota devolve error.message ao cliente', () => {
    const offenders = walk(ROUTES)
      .filter((f) => /reply[^;]*\.send\([^;]*(error|err)\.message/.test(read(f)))
      .map((f) => path.basename(f));
    expect(offenders).toEqual([]);
  });
  it('erros de negócio mostráveis usam AppError, não Error comum com status 4xx', () => {
    const offenders = walk(ROUTES)
      .filter((f) => /status\(4\d\d\)\.send\(\{ error: (error|err)\b/.test(read(f)))
      .map((f) => path.basename(f));
    expect(offenders).toEqual([]);
  });
});
