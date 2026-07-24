# Página Pública — Promoções, Conteúdo Informativo e Agendamento

Documento de referência dos **10 splits** executados para implementar Promoções e Conteúdo Informativo/Curiosidades na página pública do `saas-barbershop`, preservando 100% do agendamento e do fluxo já existentes.

**Repositório:** `Evolvetech-Johnn/saas-barbershop`
**Stack:** React 19 + Vite + TypeScript + Tailwind (front) · Fastify + Mongoose (back) · multi-tenant por `slug`

---

## Índice

1. [Como usar este documento](#1-como-usar-este-documento)
2. [Split 1 — Diagnóstico](#split-1--diagnóstico)
3. [Split 2 — Modelagem de dados (mock)](#split-2--modelagem-de-dados-mock)
4. [Split 3 — Componente de Promoções](#split-3--componente-de-promoções)
5. [Split 4 — Componente de Conteúdo Informativo](#split-4--componente-de-conteúdo-informativo)
6. [Split 5 — Integração na página pública](#split-5--integração-na-página-pública)
7. [Split 6 — Backend: models + rotas](#split-6--backend-models--rotas)
8. [Split 7 — Integração com API real (front)](#split-7--integração-com-api-real-front)
9. [Split 8 — Acessibilidade](#split-8--acessibilidade)
10. [Split 9 — SEO](#split-9--seo)
11. [Split 10 — Validação final](#split-10--validação-final)
12. [Checklist mestre](#checklist-mestre)
13. [Backlog / pendências fora de escopo](#backlog--pendências-fora-de-escopo)

---

## 1. Como usar este documento

- Execute os splits **na ordem**, um de cada vez. Cada split depende do estado deixado pelo anterior.
- Antes de iniciar um split, garanta que o anterior está com o build passando (`tsc` + `vite build` no front, `tsc` no back).
- Cada split tem: **objetivo**, **arquivos**, **passo a passo** e **checklist de validação**. Não avance para o próximo split sem fechar o checklist do atual.
- Se algo quebrar, o split é pequeno o suficiente para reverter (`git checkout -- <arquivo>` ou `git clean -fd <pasta>`) sem afetar os splits anteriores.

---

## Split 1 — Diagnóstico

**Objetivo:** mapear o repositório antes de qualquer código.

**O que foi confirmado:**
- Rotas públicas já existem: `/:slug` (`PaginaPublicaPage`) e `/:slug/agendar` (`AgendamentoPublicoPage`), ambas **funcionais**.
- `TenantContext` + `PublicLayout` resolvem tema/tenant/menu.
- Alguns componentes públicos (`ServicosPublicos`, `ProfissionaisPublicos`) usam dados **mockados localmente**, mesmo havendo APIs reais no backend — padrão pré-existente, não é bug desta feature.
- Backend usa Fastify + `@fastify/autoload` (rotas em `server/src/routes/` são registradas automaticamente, sem tocar em `index.ts`).
- App usa `HashRouter` (`/#/slug`) — limitação de SEO conhecida, fora do escopo de correção.

**Não requer ação de código.** Serve de base para todos os splits seguintes.

---

## Split 2 — Modelagem de dados (mock)

**Objetivo:** criar os tipos e os dados de exemplo, 100% front-end, zero risco.

**Arquivos criados:**
```
src/types/promocao.ts
src/types/conteudoPublico.ts
src/data/mockPromocoes.ts
src/data/mockConteudos.ts
```

**Passo a passo:**
1. Criar `src/types/promocao.ts` com a interface `Promocao` (`id`, `tenantId`, `titulo`, `descricao`, `destaque`, `imagemUrl?`, `dataInicio`, `dataFim`, `ativo`).
2. Criar `src/types/conteudoPublico.ts` com `CategoriaConteudoPublico` (`'dica' | 'curiosidade' | 'novidade'`) e a interface `ConteudoPublico`.
3. Criar `src/data/mockPromocoes.ts` com 2-3 promoções de exemplo, `tenantId` batendo com o tenant mock já existente em `mockData.ts`.
4. Criar `src/data/mockConteudos.ts` com 3-4 conteúdos de exemplo (misturando as 3 categorias).

**Checklist:**
- [ ] Nenhum arquivo existente foi tocado.
- [ ] Tipos seguem exatamente o padrão de `src/types/servico.ts`.
- [ ] `tenantId` presente em todos os registros mock.

---

## Split 3 — Componente de Promoções

**Objetivo:** criar `PromocoesPublicas.tsx`, isolado, ainda não conectado à página.

**Arquivo criado:**
```
src/components/publico/PromocoesPublicas.tsx
```

**Passo a passo:**
1. Criar o componente reaproveitando `Card` e `Button` (`src/components/ui/`) — não criar CSS novo.
2. Filtrar `mockPromocoes` por `ativo && dataFim >= hoje`; se a lista ficar vazia, retornar `null` (nunca renderizar seção vazia).
3. Cada card: imagem (`alt=""`, `loading="lazy"`), badge de destaque (`--tenant-accent`), título, descrição, período de validade formatado (`toLocaleDateString('pt-BR', ...)`), CTA linkando para `/${tenant.slug}/agendar`.
4. Seção com `<section id="promocoes" aria-labelledby="promocoes-titulo">` e heading `<h2 id="promocoes-titulo">`.

**Checklist:**
- [ ] Componente não é importado em nenhum lugar ainda (zero risco de regressão).
- [ ] Visual segue o mesmo grid/card de `ServicosPublicos.tsx`.
- [ ] CTA aponta para a rota de agendamento **já existente** (não criar rota nova).

---

## Split 4 — Componente de Conteúdo Informativo

**Objetivo:** criar `ConteudoInformativoPublico.tsx`, mesmo padrão do Split 3.

**Arquivo criado:**
```
src/components/publico/ConteudoInformativoPublico.tsx
```

**Passo a passo:**
1. Consumir `mockConteudos`, ordenados por `dataPublicacao` (mais recente primeiro).
2. Badge de categoria (`Dica` / `Curiosidade` / `Novidade`) via `Record<CategoriaConteudoPublico, string>`.
3. Usar `<time dateTime={...}>` para a data (semântica correta).
4. Grid `lg:grid-cols-4` (mais denso que Promoções, formato "cards de blog").

**Checklist:**
- [ ] Mesmo tratamento de fallback (`retornar null` se vazio).
- [ ] Headings `h2` → `h3` corretos.
- [ ] Componente ainda isolado, não conectado à página.

---

## Split 5 — Integração na página pública

**Objetivo:** primeiro split que toca arquivos existentes — edição pontual e aditiva.

**Arquivos alterados:**
```
src/pages/public/PaginaPublicaPage.tsx   (+imports, +JSX)
src/components/layout/PublicLayout.tsx  (+2 links de menu)
```

**Passo a passo:**
1. Importar `PromocoesPublicas` e `ConteudoInformativoPublico` em `PaginaPublicaPage.tsx`.
2. Definir a ordem final das seções cuidando da **alternância de fundo claro/escuro** já usada no design:
   `Hero (claro) → Serviços (escuro) → Promoções (claro) → Conteúdo (escuro) → Equipe (claro) → Contato (escuro)`.
   > Atenção: se duas seções escuras (`bg-base-900`) ficarem lado a lado, elas se "colam" visualmente — ajuste o fundo do componente novo, não a ordem das seções antigas.
3. Adicionar 2 links (`#promocoes`, `#conteudo`) no menu de `PublicLayout.tsx`, sem remover os existentes.

**Checklist:**
- [ ] `git diff --stat` mostra apenas inserções nesses 2 arquivos (nenhuma remoção de linha existente).
- [ ] Âncoras do menu (`href`/`to`) batem exatamente com os `id` das `<section>`.
- [ ] Ritmo visual (alternância de fundo) conferido manualmente.

---

## Split 6 — Backend: models + rotas

**Objetivo:** preparar a API real, sem ainda plugar no front.

**Arquivos criados:**
```
server/src/models/Promocao.ts
server/src/models/ConteudoPublico.ts
server/src/services/promocaoService.ts
server/src/services/conteudoPublicoService.ts
server/src/routes/promocoes.ts
server/src/routes/conteudos.ts
```

**Arquivo alterado:**
```
server/src/models/index.ts   (+2 linhas de export)
```

**Passo a passo:**
1. Criar os models Mongoose seguindo exatamente `Servico.ts`: `tenantId` indexado, `timestamps: true`, soft delete via `deletedAt`.
2. Criar os services com métodos estáticos: `getAll`, `getAtivas`/`getAtivos`, `getById`, `create`, `update`, `softDelete`.
3. Criar as rotas Fastify (`GET`, `GET /:id`, `POST`, `PUT /:id`, `DELETE /:id`), todas exigindo header `x-tenant-id` (400 se ausente) — mesmo padrão de `servicos.ts`.
4. **Não editar `server/src/index.ts`** — o `@fastify/autoload` já registra qualquer arquivo novo em `server/src/routes/` automaticamente.
5. Acrescentar os 2 novos exports ao final de `server/src/models/index.ts`.

**Checklist:**
- [ ] Todas as queries são escopadas por `tenantId` (isolamento multi-tenant).
- [ ] Nenhuma rota/model/service existente foi alterado.
- [ ] `npx tsc --noEmit` (dentro de `server/`) sem erros.

---

## Split 7 — Integração com API real (front)

**Objetivo:** plugar o front na API real, **com fallback automático para o mock**.

**Arquivos criados:**
```
src/services/promocaoService.ts
src/services/conteudoPublicoService.ts
src/hooks/usePromocoes.ts
src/hooks/useConteudosPublicos.ts
```

**Arquivos alterados:**
```
src/components/publico/PromocoesPublicas.tsx        (troca mock → hook)
src/components/publico/ConteudoInformativoPublico.tsx (troca mock → hook)
```

**Passo a passo:**
1. Criar os services front usando `apiRequest` (`src/config/api.ts`), mesmo padrão de `servicoService.ts`.
2. Criar os hooks (`usePromocoes`, `useConteudosPublicos`) com a seguinte regra de fallback:
   - Erro de rede/API → usa o mock.
   - API responde `200` mas lista vazia → **também** usa o mock (evita a seção sumir enquanto o admin não cadastrou nada real).
   - Assim que existir ≥ 1 registro real no tenant, os dados reais passam a ser usados.
3. **Não** usar `addToast` de erro nesses hooks — é a página pública vista por clientes; usar apenas `console.error` para diagnóstico.
4. Nos componentes, trocar `key={item.id}` por `key={(item as any)._id || item.id}` — o Mongoose retorna `_id`, não `id` (mesmo tratamento já usado em `useServicos`/`useProfissionais`).

**Checklist:**
- [ ] Testar mentalmente/manualmente os 2 cenários de fallback (erro e vazio).
- [ ] Nenhum `addToast` de erro voltado ao visitante público.
- [ ] `key` corrigida nas duas listas.

---

## Split 8 — Acessibilidade

**Objetivo:** revisão fina de acessibilidade nas seções novas e no `PublicLayout` (já tocado no Split 5).

**Arquivo alterado:**
```
src/components/layout/PublicLayout.tsx
```

**Passo a passo:**
1. Adicionar **skip link** ("Pular para o conteúdo principal") como primeiro elemento focável da página, visível apenas no foco (`sr-only focus:not-sr-only`).
2. Adicionar `id="conteudo-principal"` no `<main>` (atenção: **não pode colidir** com o `id="conteudo"` já usado pela seção de Conteúdo Informativo).
3. Adicionar `aria-label="Navegação principal"` no `<nav>`.
4. Trocar `alt={tenant.nome}` por `alt=""` nas duas ocorrências do logo (header e footer) — o nome já é texto visível ao lado, dentro do mesmo link; manter o `alt` duplicava a leitura em leitores de tela.

**Checklist:**
- [ ] Navegar a página inteira só com `Tab` — o primeiro `Tab` deve focar o skip link.
- [ ] Nenhum `alt` redundante restante nas duas seções novas.
- [ ] `aria-labelledby` das seções (Splits 3 e 4) revalidado.

---

## Split 9 — SEO

**Objetivo:** meta tags dinâmicas por tenant + JSON-LD, **sem adicionar dependências novas**.

**Arquivos criados:**
```
src/hooks/usePublicSeo.ts
src/hooks/useLocalBusinessSchema.ts
```

**Arquivos alterados:**
```
src/pages/public/PaginaPublicaPage.tsx      (chama os 2 hooks)
src/pages/public/AgendamentoPublicoPage.tsx (chama só usePublicSeo, título)
```

**Passo a passo:**
1. Criar `usePublicSeo` usando DOM API nativa (`document.title`, `document.querySelector`/`createElement` para `<meta>`) — atualiza `title`, `description`, `og:title/description/image/url`, `twitter:card`. Restaurar o título original no `cleanup` do `useEffect`.
2. Criar `useLocalBusinessSchema` injetando `<script type="application/ld+json">` com schema `HairSalon` (subtipo de `LocalBusiness`) a partir de `tenant.nome`, `logoUrl`, `descricaoPublica`, `telefone`, `endereco`, `horarioFuncionamento`. Remover o script no `cleanup`.
3. Chamar os dois hooks em `PaginaPublicaPage.tsx` com dados do `useTenant()`.
4. Chamar só `usePublicSeo` (título/descrição) em `AgendamentoPublicoPage.tsx` — não duplicar o JSON-LD.

> **Nota de diagnóstico (não corrigir agora):** o app usa `HashRouter` (`/#/slug`). Isso limita o quanto essas meta tags ajudam crawlers que não executam JavaScript. Corrigir exigiria migrar para `BrowserRouter` — mudança arquitetural maior, deve ser um split/decisão à parte com testes de todas as rotas.

**Checklist:**
- [ ] Título do browser muda ao navegar entre tenant/agendamento.
- [ ] JSON-LD inspecionável via DevTools (`document.getElementById('schema-local-business')`).
- [ ] Nenhuma dependência nova adicionada ao `package.json`.

---

## Split 10 — Validação final

**Objetivo:** confirmar que tudo compila e nada regrediu, com comandos reais.

**Comandos (front):**
```bash
npm install
npx tsc -b            # checagem de tipos completa
npx vite build         # build de produção
```

**Comandos (back):**
```bash
cd server
npm install
npx tsc --noEmit       # checagem de tipos completa
npm run build          # gera dist/
```

**Depois de validar, limpar artefatos gerados só para o teste:**
```bash
rm -rf dist server/dist
git checkout -- package-lock.json tsconfig.tsbuildinfo   # se não houver dependência nova de fato
```

**Resultado obtido nesta execução:** ambos os builds passaram sem erros de tipo; `npm run lint` falhou por **causa pré-existente** (projeto sem `eslint.config.js`, ESLint 9 exige o novo formato) — não é regressão desta feature.

**Checklist:**
- [ ] `tsc -b` do front sem erros.
- [ ] `vite build` do front sem erros.
- [ ] `tsc --noEmit` do back sem erros.
- [ ] `npm run build` do back sem erros.
- [ ] `git status` mostra só os arquivos esperados da feature (nenhum artefato de build commitado).

---

## Checklist mestre

| Área | Status |
|---|---|
| Segurança (auth, contratos, tenant isolation) | ✅ nada alterado além do necessário |
| Funcional (agendamento intacto) | ✅ zero regressão |
| UX/UI (ritmo visual, CTAs) | ✅ alternância de fundo corrigida no Split 5 |
| Acessibilidade | ✅ skip link, aria-label, alt sem redundância |
| SEO | ✅ meta tags + JSON-LD dinâmicos; limitação do HashRouter documentada |
| Performance | ✅ `loading="lazy"`; aviso de chunk >500kB é pré-existente |
| Build real (front + back) | ✅ validado com `tsc`/`vite build` |

---

## Backlog / pendências fora de escopo

1. Popular dados reais de Promoções/Conteúdo no banco (hoje usa fallback mock até existir ≥1 registro real por tenant).
2. Criar `eslint.config.js` (projeto está sem config válida para ESLint 9).
3. Avaliar migração `HashRouter` → `BrowserRouter` para SEO real (o `vercel.json` já tem rewrite pronto para isso) — split próprio, com testes de todas as rotas.
4. Conectar a seção "Entre em Contato" da página pública (hoje hardcoded) aos dados reais do tenant — o rodapé já faz isso corretamente.
5. `ServicosPublicos`/`ProfissionaisPublicos` também usam dados mockados sem integração com a API real já existente no backend (observado, não introduzido por esta feature).
