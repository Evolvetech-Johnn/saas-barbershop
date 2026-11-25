# Migrations

Regra: `supabase-schema.sql` (raiz) é o schema consolidado e reflete produção. Toda mudança nova entra **nos dois lugares**:
1. edite `supabase-schema.sql`;
2. crie aqui um arquivo numerado com só o SQL da mudança, idempotente (`if not exists`, `drop ... if exists` antes de `create policy/constraint`).

Nunca edite uma migration já aplicada. Nada destrutivo (`drop table/column`) sem aprovação explícita.
Aplicação em produção é manual no SQL Editor do Supabase (`/sync-schema`). Marque abaixo quando aplicar.

| Arquivo | Descrição | Aplicada em produção |
|---|---|---|
| `0001_baseline.sql` | (marcador) schema consolidado até o commit 3a768a8, inclui plano Franquia | sim |
