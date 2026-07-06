# Avaliação e Correção do Sistema de Agendamentos

## Resumo das Mudanças

Foi implementada uma solução centralizada para validação de disponibilidade de agendamentos, incluindo:
1. **Bloqueio de conflitos de horários** — um profissional não pode ter dois agendamentos sobrepostos
2. **Sugestão de profissionais alternativos** — quando um horário está ocupado, o sistema sugere outros profissionais livres
3. **Filtro dinâmico de horários** — lista de horários exibida considera automaticamente a disponibilidade do profissional selecionado

---

## Arquivos Analisados

### Tipos de Dados
- **[src/types/agendamento.ts](src/types/agendamento.ts)** — Define a interface `Agendamento`
  - Adicionado campo `duracaoMinutos` para rastrear a duração de cada agendamento

### Serviços
- **[src/services/agendamentoService.ts](src/services/agendamentoService.ts)** — Lógica central de persistência
  - Analisa e persiste agendamentos no localStorage
  - Implementa o fluxo de criação/atualização/exclusão

### Componentes
- **[src/components/publico/AgendamentoPublicoForm.tsx](src/components/publico/AgendamentoPublicoForm.tsx)** — Formulário de agendamento público (cliente)
  - Oferece seleção multi-passo de serviço, profissional, data e hora
  - Permite que clientes façam agendamentos pela página pública
  
- **[src/components/agenda/AgendamentoFormModal.tsx](src/components/agenda/AgendamentoFormModal.tsx)** — Modal de agendamento para admin
  - Formulário rápido para criar/editar agendamentos
  - Usado pela página de agenda interna

### Contextos
- **[src/context/ToastContext.tsx](src/context/ToastContext.tsx)** — Notificações ao usuário
  - Já existia; apenas é utilizado para exibir mensagens de erro/sucesso

### Hooks
- **[src/hooks/useAgenda.ts](src/hooks/useAgenda.ts)** — Hook de gerenciamento de agendamentos
  - Funciona como intermediário entre componentes e serviço
  - Já estava pronto e não precisou ser alterado

---

## Implementação da Solução

### 1. Centralização da Lógica de Disponibilidade

**Arquivo:** [src/services/agendamentoService.ts](src/services/agendamentoService.ts)

#### Funções Principais

**`verificarDisponibilidade(tenantId, profissionalId, data, horario, duracaoMinutos, agendamentoId?): DisponibilidadeResultado`**
- Valida se um profissional está disponível em um horário específico
- Detecta conflitos de horários (sobreposição de intervalos)
- Retorna `{ disponivel: boolean, mensagem: string, agendamentoConflitante?: Agendamento }`
- **Regra de Negócio:** Um profissional não pode ter dois agendamentos que se sobrepõem, considerando a duração do serviço

**`obterProfissionaisDisponiveis(tenantId, data, horario, duracaoMinutos, profissionalIds?): Profissional[]`**
- Lista todos os profissionais do tenant que estão livres em um horário específico
- Filtra apenas profissionais ativos
- Permite limitação a um subconjunto de IDs

**`construirDataHora(data, horario): Date`** (auxiliar)
- Converte strings de data (YYYY-MM-DD) e hora (HH:mm) em objetos Date
- Trata ambos os formatos (string e Date nativo)

**`isAgendamentoAtivo(agendamento): boolean`** (auxiliar)
- Define quais status de agendamento ("confirmado", "concluido", etc.) bloqueiam novos agendamentos
- Apenas agendamentos "confirmado" bloqueiam novos horários

---

### 2. Interface Pública de Agendamento

**Arquivo:** [src/components/publico/AgendamentoPublicoForm.tsx](src/components/publico/AgendamentoPublicoForm.tsx)

**Fluxo de Multi-Passos:**

1. **Passo 1 — Seleção de Serviço**
   - Cliente escolhe qual serviço deseja
   - Mostra duração (minutos) e preço

2. **Passo 2 — Seleção de Profissional**
   - Cliente escolhe o profissional desejado
   - Reset do horário ao trocar profissional (garante coerência)

3. **Passo 3 — Seleção de Data e Hora**
   - Calendário para seleção de data
   - **Horários dinamicamente filtrados** — apenas mostra horários livres para o profissional selecionado
   - Se não houver disponibilidade, exibe mensagem ao cliente
   - **Sugestão de Profissionais Alternativos** — lista profissionais que estão livres naquele exato horário
   - Cliente pode clicar em um profissional alternativo para trocar

4. **Passo 4 — Confirmação**
   - Validação final antes de salvar (verifica novamente disponibilidade)
   - Mensagem de sucesso/erro com toast

**Comportamentos Implementados:**

- ✅ **Apenas horários livres são exibidos**: O componente usa `useMemo` para filtrar `mockHorarios` baseado na disponibilidade real do profissional
- ✅ **Atualização dinâmica**: Se o usuário muda de profissional, a lista de horários se recalcula automaticamente
- ✅ **Sugestão de alternativas**: Quando há conflito, mostra uma seção "Profissionais alternativos neste horário"
- ✅ **Mensagens claras**: Toast notifica cliente sobre conflitos, sucesso, etc.

---

### 3. Interface Interna (Admin)

**Arquivo:** [src/components/agenda/AgendamentoFormModal.tsx](src/components/agenda/AgendamentoFormModal.tsx)

**Funcionalidade:**

- Modal compacto para criar agendamentos rápidos
- Campos: cliente, telefone, profissional, serviço, data, hora
- **Validação de disponibilidade** antes de salvar
- **Exibe mensagem de erro** se horário não estiver disponível
- **Sugere profissionais alternativos** com botões clicáveis para rápida troca

**Diferenças da Interface Pública:**

- Tela única (não multi-passo)
- Admin pode insistir ou receber feedback de indisponibilidade
- Botões de alternativa para evitar refazer todo o formulário

---

### 4. Tratamento de Erros

**Validação em Dois Pontos:**

1. **No Serviço** (`createAgendamento`):
   - Verifica disponibilidade ANTES de salvar
   - Retorna `null` se não houver disponibilidade
   - Evita dados inconsistentes no localStorage

2. **No Componente**:
   - Valida novamente ao submeter (race condition protection)
   - Exibe toast com mensagem do erro
   - Permite que usuário escolha alternativa

---

## Tipo de Dados Atualizado

### `Agendamento` Interface

```typescript
export interface Agendamento {
  id: string;
  tenantId: string;
  profissionalId: string;
  clienteId?: string;
  servicoId: string;
  dataHora: Date;
  duracaoMinutos?: number;  // ✨ NOVO: necessário para calcular conflitos
  status: StatusAgendamento;
  observacoes?: string;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail?: string;
}
```

- **`duracaoMinutos`**: Rastreia quanto tempo cada agendamento ocupa
  - Extraído de `mockData.servicos[servicoId].duracaoMinutos`
  - Padrão: 30 minutos se não informado
  - Crítico para detectar sobreposições

---

## Resultado de Validação do Projeto

```
✓ 942 modules transformed.
✓ built in 8.30s
```

Nenhum erro de compilação ou importação. Todos os tipos TypeScript validados.

---

## Exemplos de Uso

### Verificar Disponibilidade (No Serviço)

```typescript
const resultado = verificarDisponibilidade(
  '1',           // tenantId
  'p1',          // profissionalId
  '2025-01-15',  // data
  '14:00',       // horario
  30             // duracaoMinutos
);

if (resultado.disponivel) {
  // Prosseguir com agendamento
} else {
  console.log(resultado.mensagem); // "Este horário já está reservado..."
}
```

### Obter Alternativas (No Componente)

```typescript
const alternativas = obterProfissionaisDisponiveis(
  '1',           // tenantId
  '2025-01-15',  // data
  '14:00',       // horario
  30,            // duracaoMinutos
  profissionaisDoTenant.map(p => p.id)
);

// alternativas = [{ id: 'p2', nome: 'Ana', ... }, { id: 'p3', nome: 'Bruno', ... }]
```

---

## Fluxograma de Decisão

```
Cliente clica em "Confirmar Agendamento"
         ↓
    Valida dados básicos (nome, profissional, data, hora)
         ↓
    Chama verificarDisponibilidade()
         ↓
    ┌─────────────────────────────┬─────────────────────────────┐
    ↓                             ↓
DISPONÍVEL                   NÃO DISPONÍVEL
    ↓                             ↓
Salva agendamento            ┌─────────────────────────────┐
    ↓                        ↓
Toast: "Sucesso"         Exibe erro
    ↓                    "Horário indisponível"
Tela 4: Confirmação          ↓
                        Chama obterProfissionaisDisponiveis()
                             ↓
                        Exibe alternativas
                             ↓
                        Cliente clica em alternativa
                             ↓
                        Volta ao formulário c/ novo profissional
```

---

## Regras de Negócio Implementadas

1. **Conflito Bloqueado**: Um profissional não pode ter dois agendamentos onde:
   - `agendamento1.dataHora` < `agendamento2.dataHora + agendamento2.duracaoMinutos`
   - E `agendamento2.dataHora` < `agendamento1.dataHora + agendamento1.duracaoMinutos`

2. **Horários Filtrados Dinamicamente**: A cada mudança de profissional ou data, recalcula quais dos `mockHorarios` estão livres

3. **Status Importa**: Apenas agendamentos com status `'confirmado'` reservam horários
   - Agendamentos `'concluido'`, `'cancelado'`, `'faltou'` não bloqueiam novos

4. **Duração Padrão**: Se `duracaoMinutos` não for informado, assume 30 minutos

---

## Testes Recomendados

### Caso 1: Agendar e Bloquear Conflito
1. Agendar "Corte" (30 min) para Profissional "Carlos" às 14:00
2. Tentar agendar "Barba" (25 min) para "Carlos" às 14:15
3. **Esperado**: Sistema bloqueia, mostra alternativas

### Caso 2: Sugerir Profissional
1. Agendar para "Ana" às 10:00
2. Tentar agendar "Corte + Barba" (55 min) para "Ana" às 10:30
3. **Esperado**: Bloqueado; sugere "Carlos" e "Bruno"

### Caso 3: Filtro Dinâmico
1. Selecionar "Carlos" → ver apenas 5 horários livres
2. Mudar para "Ana" → lista muda para 7 horários livres
3. **Esperado**: Lista se atualiza em tempo real

### Caso 4: Editar Agendamento
1. Editar agendamento existente mudando profissional/hora
2. **Esperado**: Valida novamente; não permite se conflitar com outro seu

---

## Preservação de Funcionalidades Existentes

✅ Todos os outros módulos continuam intactos:
- Clientes
- Financeiro (Comandas, Comissões)
- Estoque (Produtos)
- Planos de Fidelidade
- Dashboard
- Superadmin

✅ Tipos de dados compatíveis (backward-compatible onde possível):
- Campo `duracaoMinutos` é opcional
- Service retorna `null` em vez de lançar exceção

✅ Nenhuma breaking change nas APIs públicas

---

## Conclusão

A solução centraliza a lógica de disponibilidade em um único ponto (`verificarDisponibilidade`), evitando duplicação de regras de negócio. Ambas as interfaces (pública e admin) compartilham as mesmas funções, garantindo consistência. O sistema bloqueia conflitos, sugere alternativas dinamicamente e filtra horários em tempo real, proporcionando melhor experiência ao usuário e integridade dos dados.
