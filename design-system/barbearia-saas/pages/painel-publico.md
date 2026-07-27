# Page Override: Painel Público (Split 9 em diante)

> Segue o MASTER.md. Aqui só o que é específico desta página.

## Contexto
Página pública de cliente: promoções, conteúdo informativo e agendamento.
Split 9 = SEO (meta tags dinâmicas, Open Graph, JSON-LD LocalBusiness).

## Prioridades específicas desta página
1. **CTA de agendamento** deve estar visível acima da dobra em toda viewport (375px+).
2. **JSON-LD LocalBusiness**: usar mesmo `--color-primary` (#1E1B4B) no favicon/og:image para consistência de marca nos resultados de busca.
3. **Promoções**: destacar com o `--color-accent` (#CA8A04), nunca com `--color-destructive` (reservado para erros).
4. **Seção de serviços**: grid de cards usando `--color-card` (#1B1B30) sobre `--color-background` (#0F0F23) — manter profundidade sutil (não flat, não glass).
5. Como é página pública/SEO: priorizar performance sobre efeitos — nada de blur/backdrop-filter pesado aqui.

## Checklist adicional
- [ ] Meta tags OG usam as mesmas cores da marca (para preview em redes sociais)
- [ ] Schema.org LocalBusiness inclui `image` consistente com o hero
- [ ] CTA "Agendar" repetido após seção de depoimentos (padrão Conversion+Feature-Rich)
