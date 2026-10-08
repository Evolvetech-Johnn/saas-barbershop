---
description: Mostra o diff do supabase-schema.sql desde o ultimo commit e o SQL a colar manualmente no editor do Supabase de producao (nao ha migration runner neste projeto).
---

Rode `git diff HEAD -- supabase-schema.sql` (ou, se houver argumento, `git diff $ARGUMENTS -- supabase-schema.sql`) e leia a saida.

Se nao houver diff, diga isso e pare.

Se houver diff:
1. Resuma em 1-2 linhas o que mudou (nova coluna, nova constraint, novo seed, etc).
2. Extraia e imprima, num bloco de codigo sql pronto pra copiar e colar, **apenas os comandos DDL/DML necessarios pra aplicar essa mudanca em producao** (ex: `alter table ... add column ...`, `alter table ... drop constraint ... / add constraint ...`, `insert into ... on conflict do nothing`). Nao apenas reproduza o diff bruto do arquivo inteiro — o objetivo e algo que da pra colar direto no SQL Editor do Supabase sem editar.
3. Lembre que isso precisa ser aplicado manualmente no projeto Supabase de producao (nao ha migration runner) e pergunte se o usuario ja aplicou, pra você poder atualizar o HANDOFF.md se relevante.
