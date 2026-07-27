# Design System: Barbearia SaaS

> Nota: a base de dados da skill (ui-ux-pro-max) não tem categoria dedicada a "barbearia" —
> a mais próxima é "Beauty/Spa/Wellness" (paleta rosa, não serve para o público masculino).
> Este arquivo é uma curadoria manual combinando peças reais da base (`--domain style`,
> `--domain color`, `--domain typography`) em vez de um único resultado automático de
> `--design-system`, que retornava combinações incoerentes para esta query.

## Pattern
- **Name:** Conversion + Feature-Rich
- **CTA Placement:** Above fold
- **Sections:** Hero → Serviços/Promoções → Prova social → CTA de agendamento

## Style
- **Base:** Dark Mode inspirado em "Theater/Cinema" (dramatic dark + spotlight gold)
- **Keywords:** dark, sofisticado, clássico, masculino, premium, alto contraste
- **Performance:** Excelente | **Acessibilidade:** WCAG AA (verificar contraste do dourado em texto pequeno)

## Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0F0F23` | `--color-background` |
| Card | `#1B1B30` | `--color-card` |
| Primary | `#1E1B4B` | `--color-primary` |
| Accent/CTA (Agendar) | `#CA8A04` | `--color-accent` |
| Foreground | `#F8FAFC` | `--color-foreground` |
| Muted Foreground | `#94A3B8` | `--color-muted-foreground` |
| Border | `#4338CA` | `--color-border` |
| Destructive | `#EF4444` | `--color-destructive` |

*Notes: Dark dramático + dourado spotlight — evita tons de spa/feminino, reforça tom premium/clássico.*

## Typography
- **Heading:** Playfair Display
- **Body:** Inter
- **Mood:** elegante, premium, atemporal, sofisticado
- **Google Fonts:** https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
```

```js
// tailwind.config.js
fontFamily: {
  heading: ['Playfair Display', 'serif'],
  sans: ['Inter', 'sans-serif'],
}
```

## Key Effects
- Transições suaves 200–300ms
- Sombras discretas nos cards (sem glassmorphism/blur pesado)
- Hover sutil no CTA de agendamento
- Sem glow neon, sem animação decorativa

## Avoid (Anti-patterns)
- Paleta rosa/lavanda ou "soft UI" de spa
- Ícones em emoji
- Glassmorphism pesado (custa performance/contraste — ruim para SEO do Split 9)

## Pre-Delivery Checklist
- [ ] Contraste do dourado `#CA8A04` sobre `#0F0F23` testado em texto pequeno (mínimo 4.5:1)
- [ ] Ícones SVG (Heroicons/Lucide), nunca emoji
- [ ] `prefers-reduced-motion` respeitado
- [ ] Responsivo: 375px, 768px, 1024px, 1440px
- [ ] Foco visível em navegação por teclado

## Stack Notes (React + Tailwind)
- Labels associadas via `htmlFor` (nunca placeholder como único label)
- Inputs controlados (`value` + `onChange`)
- `onSubmit` com `preventDefault` no `<form>`, não `onClick` isolado no botão
- Estado inicial custoso via `useState(() => ...)`
