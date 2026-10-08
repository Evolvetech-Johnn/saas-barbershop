---
description: Roda type-check e testes no frontend e no backend, e lembra as pendencias conhecidas do HANDOFF.md antes de um push para main.
---

Rode em sequencia, reportando o resultado de cada passo (nao pare no primeiro erro, colete todos):

1. `npx tsc --noEmit` na raiz (frontend)
2. `npx tsc --noEmit -p server` (backend) — ou o comando equivalente dentro de `server/`, confira o `package.json` de la se precisar
3. `npm test` na raiz (Vitest)
4. `npm test` dentro de `server/` (Jest)

Ao final, resuma em uma tabela ou lista curta: o que passou, o que falhou (com o erro relevante, nao o log inteiro).

Depois, releia a secao "Pendencias conhecidas" e "Decisoes e armadilhas importantes" do `HANDOFF.md` na raiz e liste em 1 linha cada as que sao relevantes pro que esta prestes a ser commitado/pushado (ex: Stripe nao configurado, `.env` fora do git, slugs reservados, logout precisa de reload). Nao repita a lista inteira do handoff — so o que se aplica.

Nao faca `git push` sozinho — so reporte se esta pronto para push ou nao, e por que.
